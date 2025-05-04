import mongoose from "mongoose";

const CareerResultSchema = new mongoose.Schema({
  uid: { type: String, required: true }, 
  results: [
    {
      title: { type: String, required: true },
      description: String,
      matchScore: Number,
      salaryRange: String,
      growthRate: String,
      requiredSkills: [String],
      recommendedSkills: [String],
      userSkills: [String],

      certifications: [
        {
          name: String,
          provider: String,
          difficulty: String,
          duration: String,
          url: String
        }
      ],

      courses: [
        {
          name: String,
          provider: String,
          duration: String,
          url: String
        }
      ],

      category: String,

      fitReasons: [
        {
          title: String,
          description: String,
          icon: String
        }
      ],

      careerPath: [
        {
          title: String,
          yearsExperience: String,
          salary: String,
          responsibilities: [String]
        }
      ],

      detailedFitAnalysis: String
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CareerResult", CareerResultSchema);
