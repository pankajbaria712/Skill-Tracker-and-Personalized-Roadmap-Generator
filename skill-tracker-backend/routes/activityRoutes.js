import express from "express";
import Activity from "../models/Activity.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { category, type, title, description, metadata } = req.body || {};

    if (!type || !title) {
      return res.status(400).json({ message: "type and title are required" });
    }

    const activity = await Activity.create({
      user: req.user.uid,
      category: category || "other",
      type,
      title,
      description: description || "",
      metadata: metadata || {},
    });

    res.status(201).json(activity);
  } catch (err) {
    console.error("Create activity error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.uid })
      .sort({ createdAt: -1 })
      .lean();

    res.json(activities);
  } catch (err) {
    console.error("Fetch activities error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
