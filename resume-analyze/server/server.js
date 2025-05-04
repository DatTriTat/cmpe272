
// 📁 server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import authRoutes from "./routes/authRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import userRoutes from './routes/userRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// Mongoose connection (for User and CareerResult)
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("MongoDB connection error:", err);
}

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
app.use("/api", userRoutes);
app.use('/api/interview', interviewRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
