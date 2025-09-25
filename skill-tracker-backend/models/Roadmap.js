// models/Roadmap.js
import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to logged-in user
    title: { type: String, required: true },
    content: { type: Object, required: true }, // AI generated structured content
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", RoadmapSchema);
