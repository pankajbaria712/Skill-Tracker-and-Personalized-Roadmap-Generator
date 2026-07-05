import OpenAI from "openai";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import Template from "../models/Template.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateTemplate = async (req, res) => {
  try {
    const { title, description, category, skills } = req.body || {};

    if (!title || !description || !category || !Array.isArray(skills)) {
      return res.status(400).json({
        message:
          "Missing required fields. Expected { title, description, category, skills[] }",
      });
    }

    let bannerImage = null;

    // 🌟 1. Try OpenAI first
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `
      Create a high-quality rectangular web course banner titled "${title}".
      Background: futuristic coding environment with glowing JavaScript/React code,
      modern UI interface, and soft gradients (blue, cyan, purple).
      Text: "${title}" should be clearly visible in bold stylish font.
      Avoid humans, nature, or animals. Professional tech thumbnail look.
      `;

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1536x1024",
      });

      bannerImage = response.data[0].url;
      console.log("✅ OpenAI banner generated successfully");
    } catch (openAiErr) {
      console.warn(
        "⚠️ OpenAI generation failed:",
        openAiErr?.response?.data || openAiErr?.message
      );

      // 🌟 2. Fallback to Gemini
      try {
        const geminiUrl = process.env.GEMINI_IMAGE_API_URL;
        const geminiKey = process.env.GEMINI_API_KEY;

        const geminiPrompt = `
  Create a modern coding-themed banner titled "${title}".
  Show abstract UI, React/JavaScript code, futuristic gradients.
  Include the text "${title}" in the design (no humans, no nature).
  Resolution: 1536x1024.
  `;

        const geminiResponse = await axios.post(
          `${geminiUrl}?key=${geminiKey}`,
          {
            contents: [
              {
                role: "user",
                parts: [{ text: geminiPrompt }],
              },
            ],
            generationConfig: {
              mimeType: "image/png",
              responseMimeType: "image/png",
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const imageBase64 =
          geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.inlineData
            ?.data;

        if (imageBase64) {
          const uploadResponse = await cloudinary.uploader.upload(
            `data:image/png;base64,${imageBase64}`,
            { folder: "templates" }
          );
          bannerImage = uploadResponse.secure_url;
          console.log("✅ Gemini banner generated successfully");
        } else {
          throw new Error("Gemini response has no image data");
        }
      } catch (geminiErr) {
        console.warn(
          "⚠️ Gemini fallback failed:",
          geminiErr?.response?.data || geminiErr?.message
        );
      }
    }

    // 🌟 3. If still no banner, use placeholder
    if (!bannerImage) {
      const seed = encodeURIComponent(String(title).toLowerCase());
      bannerImage = `https://source.unsplash.com/1536x1024/?code,technology,react`;
    }

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
    console.error("POST /api/templates/generate error", details);
    return res
      .status(status)
      .json({ message: "Failed to create template", details });
  }
};

export default { generateTemplate };
