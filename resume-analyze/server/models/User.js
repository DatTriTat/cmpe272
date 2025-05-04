import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, default: "user" },
  provider: { type: String },

  profile: {
    fullName: { type: String },
    jobTitle: { type: String },
    phone: { type: String },
    location: { type: String },

    summary: { type: String },           
    objective: { type: String },          
    desiredRole: { type: String },      
    desiredSalary: { type: String },      
    workType: { type: String },          
    availability: { type: String },       

    skills: [
      {
        name: { type: String },
        level: { type: String },
      }
    ],

    experiences: [
      {
        company: { type: String },
        position: { type: String },
        location: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        current: { type: Boolean, default: false },
        description: { type: String },
      }
    ],

    educations: [
      {
        school: { type: String },
        degree: { type: String },
        field: { type: String },
        location: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        current: { type: Boolean, default: false },
      }
    ]
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
