/*import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import OpenAI from "openai";
import fs from "fs";
import csv from "csv-parser";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("test");
const collection = db.collection("skills");
const upload = multer({ dest: "uploads/" });

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
          console.log(`Inserted ${bulkInsertData.length} documents`);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });
});

app.post("/analyze-career", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    // 📤 Gửi file đến Affinda
    const affindaRes = await axios.post(
      "https://api.affinda.com/v2/resumes",
      form,
      {
        headers: {
          Authorization: "Bearer aff_ee03440137c0743aee51502d844836f24972999a", // 👉 thay bằng biến môi trường
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
    //send the prompt to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = completion.choices[0].message.content;

    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const parsed = JSON.parse(content);
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
});*/


// 📁 server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import authRoutes from "./routes/authRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mongoose connection (for User and CareerResult)
await mongoose.connect(process.env.MONGODB_URI);
console.log("Mongoose connected");

// MongoClient for vector search
const mongoClient = new MongoClient(process.env.MONGODB_URI);
await mongoClient.connect();
const db = mongoClient.db("test");
const skillsCollection = db.collection("skills");
const cachedCoursesCollection = db.collection("cached_courses"); 

console.log("MongoClient connected to vector DB");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/career", careerRoutes(skillsCollection, cachedCoursesCollection));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
