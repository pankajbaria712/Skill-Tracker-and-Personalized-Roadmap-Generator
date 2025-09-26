// models/Roadmap.js
import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  title: String,
  description: String,
  resources: [
    {
      type: { type: String },
      title: String,
      url: String,
    },
  ],
  completed: { type: Boolean, default: false }, // ✅ track each task
});

const RoadmapSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    title: { type: String, required: true },
    content: {
      introduction: String,
      steps: [StepSchema], // ✅ properly structured
      projects: [String],
      tips: [String],
    },
    progress: { type: Number, default: 0 }, // ✅ store progress %
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", RoadmapSchema);
