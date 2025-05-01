import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  feedback: String,
});

const interviewSessionSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase UID
  role: { type: String, required: true },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("InterviewSession", interviewSessionSchema);
