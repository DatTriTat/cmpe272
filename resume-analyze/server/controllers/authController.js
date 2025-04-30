import admin from "../firebase/firebaseAdmin.js";
import User from "../models/User.js";

export async function verifyLogin(req, res) {
  const { idToken, name = "" } = req.body;

  if (!idToken) return res.status(400).json({ error: "Missing ID token" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const provider = decoded.firebase?.sign_in_provider || "unknown";

    let user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      user = new User({
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || name || "",
        role: "user",
        provider,
        profile: {
          fullName: decoded.name || name || "",
          jobTitle: "",
          phone: "",
          location: "",
          summary: "",
          objective: "",
          desiredRole: "",
          desiredSalary: "",
          workType: "",
          availability: "",
          skills: [],
          experiences: [],
          educations: [],
        },
      });
      await user.save();
    } else {
      console.log("User already exists, skip creation.");
    }

    res.json({
      token: idToken,
      uid: user.uid,
      email: user.email,
      role: user.role,
      name: user.name,
      provider: user.provider,
      profile: user.profile,
    });
  } catch (err) {
    console.error("verifyIdToken failed:", err);
    res.status(401).json({ error: "Invalid Firebase token" });
  }
}
