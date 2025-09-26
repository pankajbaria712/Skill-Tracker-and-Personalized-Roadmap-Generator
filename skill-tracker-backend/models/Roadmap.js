// models/Roadmap.js
import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // Firebase UID as string
    title: { type: String, required: true },
    // content is the structured AI JSON (introduction, steps[], projects[], tips[])
    content: { type: Object, required: true },
    // progress as integer percent 0..100 (calculated from steps.completed)
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", RoadmapSchema);
