import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true },
    category: {
      type: String,
      default: "other",
      enum: ["skills", "roadmaps", "progress", "goals", "auth", "profile", "ai", "other"],
    },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", ActivitySchema);
