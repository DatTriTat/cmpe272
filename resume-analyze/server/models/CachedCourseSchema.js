import mongoose from "mongoose";

const CachedCourseSchema = new mongoose.Schema({
  skill: { type: String, required: true, unique: true },
  courses: [
    {
      name: { type: String, required: true },
      provider: { type: String, required: true },
      duration: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
  lastFetched: { type: Date, default: Date.now } // nếu muốn TTL
});

export default mongoose.model("CachedCourse", CachedCourseSchema);
