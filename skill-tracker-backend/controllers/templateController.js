import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import Template from "../models/Template.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Accepts JSON: { title, description, category, skills }
// Calls Google Gemini generateImage to create an image based on template details
export const generateTemplate = async (req, res) => {
  try {
    const { title, description, category, skills } = req.body || {};

    if (!title || !description || !category || !Array.isArray(skills)) {
      return res.status(400).json({
        message:
          "Missing required fields. Expected { title, description, category, skills[] }",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "GEMINI_API_KEY is not configured on the server" });
    }

    const prompt = [
      `Create a clean, modern banner image for a learning template.`,
      `Title: ${title}`,
      `Description: ${description}`,
      `Category: ${category}`,
      `Key skills: ${skills.join(", ")}`,
      `Style: minimal, high-contrast, flat illustration, no text overlays, centered composition.`,
    ].join("\n");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateImage?key=${apiKey}`;

    // Body shape based on current v1beta generateImage conventions for Gemini
    const body = {
      prompt: {
        text: prompt,
      },
      // Optional size hint; backend can adjust as needed
      // Common values: "1024x1024", "768x512", etc.
      // If API ignores unknown fields, it's harmless
      size: "1024x1024",
      // Optional safety/quality knobs can be added here
    };

    const response = await axios.post(url, body, {
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Try to extract base64 image data from known response shapes
    let base64Data = null;
    // Hypothetical Gemini inline_data format
    base64Data =
      response?.data?.candidates?.[0]?.content?.parts?.find(
        (p) => p?.inline_data?.data
      )?.inline_data?.data || base64Data;
    // Alternative common field names
    base64Data = response?.data?.image?.base64 || base64Data;
    base64Data = response?.data?.data?.[0]?.b64_json || base64Data;

    if (!base64Data) {
      return res.status(502).json({
        message: "Gemini response missing image data",
        details: response?.data || null,
      });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      { folder: "roadmap-banners" }
    );

    const bannerImage = uploadResponse?.secure_url;

    // Persist the new template
    const templateDoc = new Template({
      title,
      description,
      category,
      skills: Array.isArray(skills) ? skills : [],
      bannerImage,
    });
    const saved = await templateDoc.save();

    return res.status(201).json(saved);
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message || "Unknown error";
    console.error("POST /api/templates/generate error", details);
    return res.status(status).json({ message: "Gemini API error", details });
  }
};

export default { generateTemplate };
