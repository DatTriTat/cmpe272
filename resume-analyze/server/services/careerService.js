import OpenAI from "openai";
import fs from "fs";
import csv from "csv-parser";
import { getCoursesForSkillsToolFn } from "./courseService.js";
import { jsonrepair } from "jsonrepair";
import CareerResult from "../models/CareerResult.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createEmbedding(text) {
  if (!text || text.trim() === "") throw new Error("Empty embedding input.");
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

export async function ingestSkillsService(collection) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream("./uploads/Career_Suggestions_Dataset_modified.csv")
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
            bulkInsertData.push({ ...row, embedding });
          }
          if (bulkInsertData.length > 0) {
            await collection.insertMany(bulkInsertData);
          }
          resolve(`Inserted ${bulkInsertData.length} documents.`);
        } catch (error) {
          reject(error);
        }
      });
  });
}

export async function analyzeCareerFromProfile(
  user,
  collection,
  cachedCoursesCollection
) {
  const {
    summary = "",
    skills = [],
    educations = [],
    experiences = [],
  } = user || {};

  const normalize = (s) =>
    typeof s === "string"
      ? s
          .toLowerCase()
          .replace(/\(.*?\)/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : "";

  if (!Array.isArray(skills) || skills.length === 0) {
    console.warn("No skills provided:", user);
    return [];
  }

  const skillNames = skills
    .map((s) => normalize(String(s?.name ?? "")))
    .filter(Boolean);
  const query = skillNames.sort().join(", ");
  const currentSet = new Set(skillNames);

  const queryEmbedding = await createEmbedding(query);

  const vectorSearchResults = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index_1",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 10,
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
  You are a career assistant AI specialized in resume analysis and career matching.
  Your task is to analyze a user's resume and matched job data, then suggest career paths.
  
  You are an expert and must return a list of up to 5 career suggestions in **valid JSON format**.
  Each object must strictly follow this structure:
  
  {
    "title": string,
    "description": string,
    "matchScore": number (1–100),
    "salaryRange": string,
    "growthRate": string,
    "requiredSkills": string[],
    "recommendedSkills": string[],
    "userSkills": string[],
    "certifications": [ { "name": string, "provider": string, "difficulty": string, "duration": string, "url": string } ],
    "category": string,
    "fitReasons": [ { "title": string, "description": string, "icon": string } ],
    "careerPath": [ { "title": string, "yearsExperience": string, "salary": string, "responsibilities": string[] } ],
    "detailedFitAnalysis": string
  }
  
  Guidelines:
  - For each "fitReason", choose an appropriate Lucide icon name
  - "fitReasons" must contain exactly 3 items (not fewer or more).
  - "growthRate" should be Low, Medium or High.
  - "careerPath" should include at least one entry.
  - Populate all fields meaningfully.
  - "userSkills" must be a subset of "requiredSkills" that appear in the user's resume.
  - Use "#" as placeholder for URLs if unknown.
  - Use concise, professional wording.
  - Return pure JSON array without any wrapping, formatting, or explanations.
  - No markdown, no headings, no commentary.

  Input:
  
  User:
  """
  Summary: ${summary}
  Skills: ${query}
  Education: ${educations.map((e) => ` ${e.degree} in ${e.field}`).join(", ")}
  Experience: ${experiences.map((e) => `${e.position} at ${e.company}`).join(", ")}
  """
  
  Matched Jobs:
  """
  ${vectorSearchResults
    .map(
      (job) => `
  Title: ${job.title}
  Skills: ${job.skills_text}
  Skill Text: ${job.skills_text}
  Education: ${job.education_requirement}
  Responsibilities: ${job.responsibilities}
  `
    )
    .join("\n---\n")}
  """
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  let content = response.choices[0].message.content?.trim() || "";
  content = content.replace(/```(json)?/g, "").trim();

  let suggestions;
  try {
    suggestions = JSON.parse(content);
  } catch (err) {
    try {
      const repaired = jsonrepair(content);
      suggestions = JSON.parse(repaired);
    } catch (e) {
      console.error("Even jsonrepair failed:", e.message);
      throw new Error("Unable to parse GPT JSON.");
    }
  }

  const normalizeSet = (arr) => arr.map(normalize);

  const missingSkills = [
    ...new Set(
      suggestions.flatMap((sug) => {
        const normalizedRequired = normalizeSet(sug.requiredSkills);
        const normalizedUser = new Set(normalizeSet(sug.userSkills));
        return sug.requiredSkills.filter(
          (_, i) => !normalizedUser.has(normalizedRequired[i])
        );
      })
    ),
  ];

  const courseMap = await getCoursesForSkillsToolFn(
    { skills: missingSkills },
    cachedCoursesCollection
  );

  const enriched = suggestions.map((sug) => {
    const normalizedRequired = normalizeSet(sug.requiredSkills);
    const normalizedUser = new Set(normalizeSet(sug.userSkills));
    const missing = sug.requiredSkills.filter(
      (_, i) => !normalizedUser.has(normalizedRequired[i])
    );

    const suggestedCourses = courseMap
      .filter((entry) => missing.includes(entry.skill))
      .reduce((acc, entry) => {
        acc[entry.skill] = entry.courses;
        return acc;
      }, {});

    return {
      ...sug,
      missingSkills: missing,
      suggestedCourses,
    };
  });

  return enriched;
}

export const saveCareerResultService = async (uid, newPath) => {
  const updatedDoc = await CareerResult.findOneAndUpdate(
    { uid },
    { $push: { results: newPath } }, 
    {
      upsert: true,                
      new: true,                
      setDefaultsOnInsert: true, 
    }
  );

  return updatedDoc;
};

export const getCareerResultsByUserService = async (uid) => {
  return await CareerResult.find({ uid }).sort({ createdAt: -1 });
};
