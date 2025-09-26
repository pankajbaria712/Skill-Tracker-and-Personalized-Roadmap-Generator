// routes/roadmapRoutes.js
import express from "express";
import fetch from "node-fetch";
import Roadmap from "../models/roadmap.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper: extract JSON substring { ... } and parse
function parseJsonFromText(text) {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
    return JSON.parse(text);
  } catch (err) {
    return { rawText: text };
  }
}

function calculateProgressFromSteps(steps = []) {
  if (!Array.isArray(steps) || steps.length === 0) return 0;
  const completedCount = steps.filter((s) => s.completed).length;
  return Math.round((completedCount / steps.length) * 100);
}

// 📌 Generate roadmap with AI + save to DB
router.post("/generate", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, proficiency } = req.body || {};

    const prompt = `
You are an expert roadmap generator dedicated to helping users learn new skills.
Return ONLY valid JSON (no explanations, no markdown).

Format must be:
{
  "introduction": "short intro",
  "steps": [
    {
      "title": "Step title",
      "description": "Explain what to do in this step",
      "resources": [
        { "type": "course", "title": "Course Name", "url": "https://..." },
        { "type": "article", "title": "Article Name", "url": "https://..." }
      ]
    }
  ],
  "projects": ["Project idea 1", "Project idea 2"],
  "tips": ["Tip 1", "Tip 2"]
}

Skill: ${title}
Proficiency: ${proficiency || "not specified"}
`;

    // 🌐 Call Gemini
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await aiRes.json();
    if (!aiRes.ok) {
      console.error("Gemini API error:", data);
      return res
        .status(502)
        .json({ message: "AI service error", details: data });
    }

    // ✅ Extract actual text from Gemini response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let parsedContent = parseJsonFromText(text);

    // Ensure steps exist and mark with completed:false
    if (!parsedContent.steps || !Array.isArray(parsedContent.steps)) {
      parsedContent.steps = [];
    }
    parsedContent.steps = parsedContent.steps.map((s) => ({
      title: s.title || s.name || "Untitled step",
      description: s.description || "",
      resources: Array.isArray(s.resources) ? s.resources : [],
      completed: false,
    }));

    if (!parsedContent.projects) parsedContent.projects = [];
    if (!parsedContent.tips) parsedContent.tips = [];

    const progress = calculateProgressFromSteps(parsedContent.steps);

    // Save roadmap
    const roadmap = new Roadmap({
      user: req.user.uid,
      title: title || parsedContent.title || "Untitled",
      content: parsedContent,
      progress,
    });

    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error("Error generating roadmap:", err);
    res
      .status(500)
      .json({ message: "Failed to generate roadmap", error: err?.message });
  }
});

// 📌 Get all roadmaps
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.uid }).sort({
      createdAt: -1,
    });
    res.json(roadmaps);
  } catch (err) {
    console.error("Error fetching roadmaps:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📌 Toggle step completed
router.patch(
  "/:id/steps/:index/toggle",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const { id, index } = req.params;
      const roadmap = await Roadmap.findOne({ _id: id, user: req.user.uid });
      if (!roadmap)
        return res.status(404).json({ message: "Roadmap not found" });

      const steps = roadmap.content.steps || [];
      const idx = parseInt(index, 10);
      if (isNaN(idx) || idx < 0 || idx >= steps.length) {
        return res.status(400).json({ message: "Invalid step index" });
      }

      steps[idx].completed = !steps[idx].completed;

      roadmap.content.steps = steps;
      roadmap.progress = calculateProgressFromSteps(steps);

      await roadmap.save();
      res.json(roadmap);
    } catch (err) {
      console.error("Error toggling step:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 📌 Delete roadmap
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    await Roadmap.findOneAndDelete({ _id: req.params.id, user: req.user.uid });
    res.json({ message: "Roadmap deleted" });
  } catch (err) {
    console.error("Error deleting roadmap:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
