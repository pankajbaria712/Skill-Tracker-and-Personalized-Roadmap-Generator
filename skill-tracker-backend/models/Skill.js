// models/Skill.js
import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // ✅ Firebase UID as string
    name: { type: String, required: true },
    proficiency: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", SkillSchema);
