// models/Roadmap.js
import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // ✅ Firebase UID as string
    title: { type: String, required: true },
    content: { type: Object, required: true }, // AI generated structured content
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", RoadmapSchema);
