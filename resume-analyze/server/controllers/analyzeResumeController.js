import {
  ingestSkillsService,
  analyzeCareerFromProfile,
} from "../services/careerService.js";
import {
  analyzeResumeService,
  mapResumeToProfile,
} from "../services/resumeService.js";
import User from "../models/User.js";

export const analyzeResumeController = async (req, res) => {
  try {
    const file = req.file; // Assuming the file is sent as a buffer in the request body
    const analysisResult = await analyzeResumeService(file);

    console.log("Analysis Result:", analysisResult);
    res.json({
      success: true,
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("Analyze Resume Controller Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to analyze resume" });
  }
};

export async function ingestSkills(req, res, collection) {
  try {
    const result = await ingestSkillsService(collection);
    res.json({ message: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function analyzeCareer(
  req,
  res,
  collection,
  cachedCoursesCollection
) {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const result = await analyzeCareerFromProfile(
      user.profile,
      collection,
      cachedCoursesCollection
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function mapResumeToProfileFromFile(req, res) {
  try {
    const profile = await mapResumeToProfile(req.file);

    res.json({
      message: "Resume mapped to profile successfully",
      profile,
    });
  } catch (error) {
    console.error("Error mapping resume to profile:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
