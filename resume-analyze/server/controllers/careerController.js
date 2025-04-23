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
  fs.createReadStream("./uploads/Generated_Career_Database_final.csv")
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
    const cleanEducation =
      education
        ?.map((e) => `${e.accreditation} at ${e.institution}`)
        .join(", ") || "None";
    const cleanExperience =
      workExperience
        ?.map((e) => `${e.jobTitle} at ${e.organization}`)
        .join(", ") || "None";

    const queryEmbedding = await createEmbedding(query);

    const vectorSearchResults = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index_1",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 3,
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
      1. A list of skills and summary from the user's resume.
      2. 1–3 matched jobs with descriptions and requirements from a vector database.
      
      Your task:
      Return a list of 1 to 3 career suggestions in **valid JSON format**.
      
      Each object should follow this format:
      [
        {
          "title": string,
          "description": string,      // A professional summary of the role and candidate fit
          "skills": string[],         // Include all related skills (skills_text + skills_required)
          "certification": string[],  // Common certifications for this role
          "education": string,        // Specific education field, e.g., "Bachelor's in Data Science"
          "why_fit": string           // Why this candidate is a good fit (based on resume & DB)
        }
      ]
      
      Guidelines:
      - "description": professional 3rd-person tone, combine resume & job requirements
      - "why_fit": summarize matching experience and skills
      - Fill all fields. Do not leave arrays empty.
      - If a certification is not found, suggest at least one relevant one.
      - **Return JSON only**. No comments or markdown.
      
      From User:
      """
      Summary: ${summary}
      Skills: ${query}
      Education: ${education
        .map((e) => `${e.institution} (${e.accreditation})`)
        .join(", ")}
      Experience: ${workExperience
        .map((e) => `${e.jobTitle} at ${e.organization}`)
        .join(", ")}
      """
      
      Matched Jobs from Vector DB:
      """
      ${vectorSearchResults
        .map((job) => {
          return `
      Title: ${job.job_position_name}
      Skills Text: ${job.skills_text}
      Skills Required: ${job.skills_required}
      Education: ${job.educationaL_requirements}
      Responsibilities: ${job.responsibilities}
      `;
        })
        .join("\n---\n")}
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
    // Add education to the result
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

    const normalize = (s) =>
      typeof s === "string"
        ? s
            .toLowerCase()
            .replace(/\(.*?\)/g, "")
            .replace(/\s+/g, " ")
            .trim()
        : "";

    const currentSet = new Set(skills.map((s) => normalize(s.name)));

    const updatedCareers = gptResult.map((career) => {
      const careerSkills = (career.skills || []).map(normalize);
      const matchedSkills = careerSkills.filter((s) => currentSet.has(s));
      const missingSkills = careerSkills.filter((s) => !currentSet.has(s));

      return {
        ...career,
        matchedSkills,
        missingSkills,
      };
    });
    res.json(updatedCareers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
