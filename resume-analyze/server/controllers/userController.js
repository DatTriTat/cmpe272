import User from "../models/User.js";
import {
  saveCareerResultService,
  getCareerResultsByUserService,
} from "../services/careerService.js";
export async function updateProfile(req, res) {
  try {
    const uid = req.user.uid;

    const {
      fullName,
      jobTitle,
      phone,
      location,
      summary,
      objective,
      desiredRole,
      desiredSalary,
      workType,
      availability,
      skills,
      experiences,
      educations,
    } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          "profile.fullName": fullName,
          "profile.jobTitle": jobTitle,
          "profile.phone": phone,
          "profile.location": location,
          "profile.summary": summary,
          "profile.objective": objective,
          "profile.desiredRole": desiredRole,
          "profile.desiredSalary": desiredSalary,
          "profile.workType": workType,
          "profile.availability": availability,
          "profile.skills": skills || [],
          "profile.experiences": experiences || [],
          "profile.educations": educations || [],
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error("Profile update failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export const saveCareerResult = async (req, res) => {
  const uid = req.user.uid;
  const { results } = req.body;
  if (!uid || !Array.isArray(results)) {
    return res.status(400).json({ error: "uid and results are required." });
  }

  try {
    await saveCareerResultService(uid, results);
    res.status(201).json({ message: "Career result saved." });
  } catch (err) {
    console.error("Save failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCareerResultsByUser = async (req, res) => {
  const uid = req.user.uid;
  try {
    const data = await getCareerResultsByUserService(uid);
    res.json(data);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
