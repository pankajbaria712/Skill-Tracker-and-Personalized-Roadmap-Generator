// 3️⃣ models/Skill.js
import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    proficiency: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", SkillSchema);
