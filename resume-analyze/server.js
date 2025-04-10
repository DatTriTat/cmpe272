import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import OpenAI from "openai";
import fs from "fs";
import csv from "csv-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("test");
const collection = db.collection("skills");

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Embedding function
async function createEmbedding(text) {
  if (!text || text.trim() === "") {
    throw new Error("Embedding input text is required.");
  }

  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

// Ingest
app.post("/ingest", async (req, res) => {
  const results = [];

  fs.createReadStream("./uploads/resume_part_3.csv")
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
          console.log(`Inserted ${bulkInsertData.length} documents`);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });
});

app.post("/analyze-career", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res
      .status(400)
      .json({ error: "resumeContent and query are required." });
  }
  try {
    const queryEmbedding = await createEmbedding(query);
    const vectorSearchResults = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
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

    //send the prompt to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);
    console.log("📄 GPT response:", parsed);
    res.json(parsed);
  } catch (error) {
    console.error("GPT or search error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server running!" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
