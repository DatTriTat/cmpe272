import admin from "../firebase/firebaseAdmin.js";
import User from "../models/User.js";

export async function verifyLogin(req, res) {
  const { idToken } = req.body;
    // Check if idToken is provided
  if (!idToken) return res.status(400).json({ error: "Missing ID token" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const provider = decoded.firebase?.sign_in_provider || "unknown";
    console.log("Token decoded:", decoded);
    let user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || req.body.name || "",
        role: "user",
        provider,
      });
    }

    res.json({
      uid: user.uid,
      email: user.email,
      role: user.role,
      name: user.name,
      provider: user.provider,
    });
  } catch (err) {
    console.error("verifyIdToken failed:", err);

    res.status(401).json({ error: "Invalid Firebase token" });
  }
}