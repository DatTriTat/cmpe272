import OpenAI from "openai";
import CareerResult from "../models/CareerResult.js";
import User from "../models/User.js";
import fs from "fs";
import csv from "csv-parser";
import FormData from "form-data";
import axios from "axios";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Embedding function
export async function createEmbedding(text) {
  if (!text || text.trim() === "") throw new Error("Empty embedding input.");
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

export async function ingestSkills(req, res, collection) {
  const results = [];
  fs.createReadStream("./uploads/resume_part_1.csv")
    .pipe(csv())
    .on("data", (data) => {
      if (data.skills_text && data.skills_text.trim() !== "") {
        results.push(data);
      }
    })
    .on("end", async () => {
      try {
        const bulkInsertData = [];
        for (const row of results) {
          const embedding = await createEmbedding(row.skills_text);
          bulkInsertData.push({
            ...row,
            embedding,
          });
        }
        if (bulkInsertData.length > 0) {
          await collection.insertMany(bulkInsertData);
          console.log(`Inserted ${bulkInsertData.length} documents.`);
        }
        res.json({ message: "Ingest completed" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });
}

export async function analyzeCareer(req, res, collection) {
  try {
    const filePath = req.file.path;
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const affindaRes = await axios.post(
      "https://api.affinda.com/v2/resumes",
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.AFFINDA_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );
    fs.unlinkSync(filePath);
    const { summary, skills, education, workExperience } = affindaRes.data.data;
    const query = skills
      .map((s) => s.name.trim().toLowerCase())
      .sort()
      .join(", ");

    const queryEmbedding = await createEmbedding(query);

    const vectorSearchResults = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index_1",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 5,
          },
        },
        {
          $project: {
            embedding: 0,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    const prompt = `
      You are an expert career assistant and resume analyzer.
  
      You will be given:
      1. Resume content (parsed from uploaded file)
      2. Related information from a job vector database (job descriptions, responsibilities, required skills, company expectations, etc.)
  
      Your task is to analyze both sources and return **a list of 1 to 3 best-fit career suggestions** in **valid JSON format**.
  
      [
        {
          "title": string,
          "description": string,
          "skills": string[],
          "certification": string[]
        }
      ]
  
      Guidelines for the "description" field:
      - Write in professional tone (3rd person)
      - Focus on candidate’s potential, experience, and strengths
      - Combine resume experience + matched job expectations
      - Avoid generic phrases; tailor it based on actual resume content and roles from DB
  
      All fields must be filled. Do not leave any array empty.
      If a field like "certification" has no direct match, you must suggest at least one relevant or common certification that could help the candidate grow in this role.
  
      No extra commentary, explanation, or markdown.
      Only return a valid JSON object. No text before or after.
  
      From User's Skills :
      """
      ${query}
      """
      Related Research from Job Database:
      """
      ${JSON.stringify(vectorSearchResults, null, 2)}
      """
      `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = completion.choices[0].message.content;
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const gptResult = JSON.parse(content);
    /*
    let user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
      });
    }

    await CareerResult.create({
      user: user._id || "",
      inputQuery: query,
      matchedJobs: vectorSearchResults,
      gptSuggestions: gptResult,
    });*/

    res.json(gptResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
