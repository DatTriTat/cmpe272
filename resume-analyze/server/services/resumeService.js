import fs from "fs";
import { OpenAI } from "openai";
import { parseResume } from "../utils/parseResume.js";
import { fetchJobDescriptionFromApify } from "../utils/indeedScaper.js";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const analyzeResumeService = async (file, jobUrl = null) => {
  const data = await parseResume(file);
  let jobDescription = "";
  console.log("check:", jobUrl);
  if (jobUrl) {
    jobDescription = await fetchJobDescriptionFromApify(jobUrl);
  }
  const prompt = `
  You are a resume evaluation assistant.

  Given the following parsed resume (extracted using Affinda)${jobDescription ? " and the job description provided below" : ""}, return a JSON object with all of the following:

  {
    "overallScore": number (0-100),
    "formatScore": number (0-100),
    "contentScore": number (0-100),
    "skillsScore": number (0-100),
    "atsScore": number (0-100),
    "grammarScore": number (0-100),

    "keyFindings": {
      "strengths": [string],
      "areasToImprove": [string],
      "criticalIssues": [string]
    },

    "improvementSuggestions": {
      "content": [string],
      "format": [string],
      "atsOptimization": [string]
    },

    "atsCompatibilityDetails": {
      "score": number (0-100),
      "issues": [
        {
          "title": string,
          "description": string,
          "fix": string
        }
      ]
    }${
      jobUrl
        ? `,
    "keywordMatches": [
      {
        "keyword": string,
        "count": number,
        "recommended": 3
      }
    ],
    "suggestedKeywords": [string]`
        : ""
    }
  }

  IMPORTANT:
  - Only return a valid JSON object.
  - Do not include any explanation or markdown.
  - Do not wrap the response in triple backticks.
  - Always return suggested keywords that are missing or should be improved in the resume.


  ${
    jobDescription
      ? `
  Job Description:
  ${jobDescription}
  `
      : ""
  }

  Resume:
  ${data.rawText}
  `;
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  let rawContent = completion.choices[0].message.content.trim();

  if (rawContent.startsWith("```")) {
    rawContent = rawContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  }

  const analysisResult = JSON.parse(rawContent);

  return analysisResult;
};

export async function mapResumeToProfile(file) {
  const data = await parseResume(file);

  return {
    fullName:
      [data.name?.first, data.name?.middle, data.name?.last]
        .filter(Boolean)
        .join(" ") || "",
    jobTitle: data.profession || "",
    phone: data.phoneNumbers?.[0] || "",
    location: data.location?.formatted || "",
    summary: data.summary || "",
    objective: data.objective || "",
    desiredRole: data.jobTitle || "",
    desiredSalary: data.desiredSalary || "",
    workType: data.workType || "",
    availability: data.availability || "",

    skills: (data.skills || []).map((s) => ({
      name: s.name,
      level: s.level || "Intermediate",
    })),

    experiences: (data.workExperience || []).map((exp) => ({
      company: exp.organization,
      position: exp.jobTitle,
      location: exp.location?.formatted || "",
      startDate: exp.dates?.startDate || "",
      endDate: exp.dates?.endDate || "",
      current: exp.dates?.endDate === null,
      description: exp.jobDescription || "",
    })),

    educations: (data.education || []).map((edu) => ({
      school: edu.organization,
      degree: edu.accreditation?.education || "",
      field: edu.accreditation?.inputStr || "",
      location: edu.location?.formatted || "",
      startDate: edu.dates?.startDate || edu.dates?.completionDate || "",
      endDate: edu.dates?.completionDate || "",
      current: edu.dates?.isCurrent || false,
    })),
  };
}
