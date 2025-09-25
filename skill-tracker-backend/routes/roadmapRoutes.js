// routes/roadmapRoutes.js
import express from "express";
import fetch from "node-fetch";
import Roadmap from "../models/Roadmap.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper: try multiple common paths to extract text from AI response
function extractTextFromAIResponse(data, rawBody) {
  // Try several likely locations
  const tryFns = [
    (d) => d?.candidates?.[0]?.content?.parts?.[0]?.text,
    (d) => d?.candidates?.[0]?.content?.text,
    (d) => d?.candidates?.[0]?.message?.content?.[0]?.text,
    (d) => d?.outputText,
    (d) => d?.outputs?.[0]?.content?.[0]?.text,
    (d) => d?.responses?.[0]?.output?.[0]?.content?.text,
    (d) => d?.generated_text,
  ];

  for (const fn of tryFns) {
    try {
      const t = fn(data);
      if (t && typeof t === "string" && t.trim().length > 0) return t;
    } catch (e) {
      // ignore
    }
  }

  // If data itself is a string (raw body), return that
  if (typeof data === "string" && data.trim().length > 0) return data;

  // fallback to rawBody if available
  if (typeof rawBody === "string" && rawBody.trim().length > 0) return rawBody;

  // nothing found
  return "";
}

// Helper: extract JSON substring { ... } and parse
function parseJsonFromText(text) {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
    // If exact JSON not found, try to parse whole text (in case it's pure JSON)
    return JSON.parse(text);
  } catch (err) {
    // parsing failed
    return { rawText: text };
  }
}

// 📌 Generate roadmap with AI + save to DB
router.post("/generate", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, proficiency } = req.body || {};

    // Prompt: strict JSON required
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

    // Call Gemini API (server-side)
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

    // Always capture raw body for debugging
    const rawBody = await aiRes.text();

    if (!aiRes.ok) {
      console.error("Gemini API error status:", aiRes.status, "body:", rawBody);
      return res.status(502).json({
        message: "AI service error",
        details: rawBody ? rawBody.slice(0, 1000) : "empty response",
      });
    }

    // Try to parse JSON body; if not JSON, fallback to raw string
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = rawBody;
    }

    console.log(
      "AI raw response:",
      typeof rawBody === "string" ? rawBody.slice(0, 2000) : rawBody
    );

    // Extract actual text (various possible shapes)
    const text = extractTextFromAIResponse(parsedBody, rawBody);

    if (!text || text.trim().length === 0) {
      console.warn("AI returned empty text. Full body:", rawBody);
      // Save a roadmap with rawBody so dev can inspect
      const roadmapFallback = new Roadmap({
        user: req.user.uid,
        title: title || "Untitled",
        content: { rawText: rawBody || "" },
      });
      await roadmapFallback.save();
      return res.status(200).json({
        message:
          "Saved fallback roadmap (AI returned empty). Check server logs for AI raw response.",
        roadmap: roadmapFallback,
      });
    }

    // Parse JSON out of the extracted text
    const parsed = parseJsonFromText(text);

    // Save roadmap
    const roadmap = new Roadmap({
      user: req.user.uid,
      title: title || "Untitled",
      content: parsed,
    });

    await roadmap.save();
    return res.json(roadmap);
  } catch (err) {
    console.error("Error generating roadmap:", err);
    return res
      .status(500)
      .json({ message: "Failed to generate roadmap", error: err?.message });
  }
});

// Get all roadmaps
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

// Delete roadmap
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
