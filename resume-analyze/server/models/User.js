import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: "user" },
  provider: { type: String }, 
});

export default mongoose.model("User", UserSchema);