// routes/roadmapRoutes.js
import express from "express";
import fetch from "node-fetch";
import Roadmap from "../models/Roadmap.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Helper: safely parse JSON from AI
function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return { rawText: str };
  }
}

// 📌 Generate roadmap with AI + save to DB
router.post("/generate", verifyFirebaseToken, async (req, res) => {
  try {
    const { title } = req.body;

    const prompt = `
You are an expert roadmap generator dedicated to helping users learn new skills. 
Your task is to provide a step-by-step learning plan with carefully curated resources, 
including high-quality courses, books, tutorials, and projects. Respond only to requests 
about skills and learning.

Format your responses as follows:
1. **Introduction**
2. **Core Steps**
3. **Resources**
4. **Projects**
5. **Additional Tips**

Skill requested: ${title}
`;

    // 🌐 Call Gemini (server-side)
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await aiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = tryParseJSON(text);

    // 💾 Save roadmap to MongoDB
    const roadmap = new Roadmap({
      user: req.user.uid, // ✅ Firebase UID
      title,
      content: parsed,
    });

    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error("Error generating roadmap:", err);
    res.status(500).json({ message: "Failed to generate roadmap" });
  }
});

// 📌 Get all roadmaps for logged-in user
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.uid }).sort({
      createdAt: -1,
    });
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Delete roadmap
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    await Roadmap.findOneAndDelete({ _id: req.params.id, user: req.user.uid });
    res.json({ message: "Roadmap deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
