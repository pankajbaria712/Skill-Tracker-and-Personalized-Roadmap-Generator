// routes/roadmapRoutes.js
import express from "express";
import fetch from "node-fetch";
import Roadmap from "../models/Roadmap.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Clean JSON text from Gemini
function extractJson(text) {
  if (!text) return { rawText: "" };
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse failed:", err.message);
    return { rawText: cleaned };
  }
}

function calculateProgressFromSteps(steps = []) {
  if (!Array.isArray(steps) || steps.length === 0) return 0;
  const completed = steps.filter((s) => s.completed).length;
  return Math.round((completed / steps.length) * 100);
}

// 📌 Generate roadmap with AI
router.post("/generate", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, proficiency } = req.body || {};

    const prompt = `
You are an expert roadmap generator dedicated to helping users learn new skills.  
Return ONLY valid JSON (no explanations, no markdown).  

Format:
{
  "introduction": "short intro",
  "steps": [
    {
      "title": "Step title",
      "description": "Explain",
      "resources": [
        { "type": "course", "title": "Course Name", "url": "https://..." }
      ]
    }
  ],
  "projects": ["Project idea 1"],
  "tips": ["Tip 1"]
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

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("Gemini API error:", aiRes.status, errText);
      return res
        .status(502)
        .json({ message: "Gemini API error", details: errText });
    }

    const data = await aiRes.json();

    // ✅ extract text only
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = extractJson(text);

    // ensure steps array & add completed:false
    parsed.steps = Array.isArray(parsed.steps)
      ? parsed.steps.map((s) => ({
          title: s.title || "Untitled step",
          description: s.description || "",
          resources: Array.isArray(s.resources) ? s.resources : [],
          completed: false,
        }))
      : [];

    const progress = calculateProgressFromSteps(parsed.steps);

    const roadmap = new Roadmap({
      user: req.user.uid,
      title: title || parsed.title || "Untitled",
      content: parsed,
      progress,
    });

    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error("Error generating roadmap:", err);
    res
      .status(500)
      .json({ message: "Failed to generate roadmap", error: err.message });
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

      const steps = roadmap.content?.steps || [];
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
