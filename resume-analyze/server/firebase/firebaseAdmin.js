// firebase/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); 

const serviceAccountPath =process.env.FIREBASE_KEY_PATH || "./serviceAccountKey.json";
console.log ("Service account path:", serviceAccountPath);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));


console.log("Firebase service account loaded from:", serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
