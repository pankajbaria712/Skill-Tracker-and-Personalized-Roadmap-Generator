import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import Template from "../models/Template.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/templates/generate
// Body: { title, description, category, skills[] }
export const generateTemplate = async (req, res) => {
  try {
    const { title, description, category, skills } = req.body || {};

    // 🧩 Validation
    if (!title || !description || !category || !Array.isArray(skills)) {
      return res.status(400).json({
        message:
          "Missing required fields. Expected { title, description, category, skills[] }",
      });
    }

    let bannerImage = null;
    let styleHint = "";

    // 🎨 (Optional) Get style hints from Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const geminiPrompt = `
          Suggest a short futuristic web design style for a roadmap banner titled "${title}".
          Description: ${description}.
          Focus on tech colors, gradients, UI layout, and modern design aesthetics.
        `;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const geminiBody = {
          contents: [{ parts: [{ text: geminiPrompt }] }],
        };

        const geminiResponse = await axios.post(geminiUrl, geminiBody, {
          timeout: 20000,
          headers: { "Content-Type": "application/json" },
        });

        styleHint =
          geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "";
        console.log("🧠 Gemini style hint:", styleHint);
      } catch (err) {
        console.warn("⚠️ Gemini text hint failed:", err?.message);
      }
    }

    // 🖼️ Generate image via OpenAI (gpt-image-1)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const imagePrompt = `
          A modern roadmap banner for "${title}".
          Description: ${description}.
          Style inspiration: ${styleHint}.
          Create a clean, tech-inspired UI illustration with glowing gradients (blue, purple, cyan).
          Include roadmap or progress visuals, icons, and minimal design.
          Avoid people, landscapes, and any text.
        `;

        const openaiResponse = await axios.post(
          "https://api.openai.com/v1/images/generations",
          {
            model: "gpt-image-1",
            prompt: imagePrompt,
            size: "1024x1024",
            quality: "hd",
            response_format: "b64_json", // ✅ safer than URL
          },
          {
            headers: {
              Authorization: `Bearer ${openaiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 60000,
          }
        );

        const imageBase64 = openaiResponse.data?.data?.[0]?.b64_json;

        if (imageBase64) {
          const uploadRes = await cloudinary.uploader.upload(
            `data:image/png;base64,${imageBase64}`,
            { folder: "ai-banners" }
          );
          bannerImage = uploadRes.secure_url;
          console.log("✅ Cloudinary upload success:", bannerImage);
        } else {
          console.warn("⚠️ No image data received from OpenAI");
        }
      } catch (err) {
        console.warn(
          "⚠️ OpenAI image generation failed:",
          err?.response?.data || err?.message
        );
      }
    }

    // 🖼️ Fallback image
    if (!bannerImage) {
      const seed = encodeURIComponent(title.toLowerCase());
      bannerImage = `https://picsum.photos/seed/${seed}/1024/512`;
      console.warn("⚠️ Using fallback image:", bannerImage);
    }

    // 💾 Save Template
    const templateDoc = new Template({
      title,
      description,
      category,
      skills,
      bannerImage,
    });

    const saved = await templateDoc.save();
    return res.status(201).json(saved);
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message || "Unknown error";
    console.error("❌ POST /api/templates/generate error:", details);
    return res
      .status(status)
      .json({ message: "Failed to create template", details });
  }
};

export default { generateTemplate };
