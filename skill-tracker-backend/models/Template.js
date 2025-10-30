import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["roadmap", "growth"], required: true },
  thumbnail: { type: String, required: true },
  duration: { type: String, required: true },
  skillCount: { type: Number, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  featured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Template = mongoose.model("Template", templateSchema);

export default Template;
