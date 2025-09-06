// 6️⃣ routes/skillsRoutes.js
import express from "express";
const router = express.Router();
import Skill from "../models/Skill.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

// Add Skill
router.post("/", verifyFirebaseToken, async (req, res) => {
  const { name, proficiency } = req.body;
  try {
    const skill = new Skill({ user: req.user.id, name, proficiency });
    await skill.save();
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Skills for logged-in user
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Skill
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  const { name, proficiency } = req.body;
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, proficiency },
      { new: true }
    );
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Skill
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    await Skill.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
