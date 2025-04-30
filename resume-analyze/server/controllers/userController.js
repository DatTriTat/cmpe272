import User from "../models/User.js";

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