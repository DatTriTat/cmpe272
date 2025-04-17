import mongoose from "mongoose";

const CareerResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔗 Liên kết
  inputQuery: { type: String, required: true },
  matchedJobs: { type: Array, default: [] },
  gptSuggestions: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CareerResult", CareerResultSchema);
