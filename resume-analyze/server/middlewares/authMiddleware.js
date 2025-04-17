import admin from "../firebase/firebaseAdmin.js";

export async function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || "user",
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
