import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  skills: [{ type: String, default: [] }],
  bannerImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Template = mongoose.model("Template", templateSchema);

export default Template;
