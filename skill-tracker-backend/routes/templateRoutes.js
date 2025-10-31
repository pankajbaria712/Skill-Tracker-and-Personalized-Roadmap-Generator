import express from "express";
import Template from "../models/Template.js"; // Add this import
import { generateTemplate } from "../controllers/templateController.js";

const router = express.Router();

// GET /api/templates
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error("GET /api/templates error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/templates
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      thumbnail,
      duration,
      skillCount,
      category,
      difficulty,
      featured,
      skills,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !type ||
      !thumbnail ||
      !duration ||
      !category
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "title",
          "description",
          "type",
          "thumbnail",
          "duration",
          "category",
        ],
      });
    }

    const tpl = new Template({
      title,
      description,
      type,
      thumbnail, // Don't use empty string fallback
      duration, // Don't use empty string fallback
      skillCount: Number(skillCount) || 0,
      category,
      difficulty,
      featured: !!featured,
      skills: Array.isArray(skills) ? skills : [],
    });

    const saved = await tpl.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/templates error", err);
    res.status(500).json({
      message: "Server error",
      details: err.message,
    });
  }
});

// POST /api/templates/generate
router.post("/generate", generateTemplate);

export default router;
