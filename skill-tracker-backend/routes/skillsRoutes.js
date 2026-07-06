// routes/skillsRoutes.js
import express from "express";
const router = express.Router();
import Skill from "../models/Skill.js";
import Activity from "../models/Activity.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

// 📌 Add Skill
router.post("/", verifyFirebaseToken, async (req, res) => {
  const { name, proficiency } = req.body;
  try {
    const skill = new Skill({ user: req.user.uid, name, proficiency }); // ✅ use uid
    await skill.save();
    await Activity.create({
      user: req.user.uid,
      category: "skills",
      type: "skill_added",
      title: `${name} skill added`,
      description: `You added ${name} to your skill list.`,
      metadata: { skillName: name, proficiency },
    });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get All Skills for logged-in user
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.uid }); // ✅ use uid
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Update Skill
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  const { name, proficiency } = req.body;
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user.uid }, // ✅ use uid
      { name, proficiency },
      { new: true }
    );
    if (skill) {
      await Activity.create({
        user: req.user.uid,
        category: "skills",
        type: "skill_updated",
        title: `${skill.name} skill updated`,
        description: `You updated ${skill.name} in your skill list.`,
        metadata: { skillName: skill.name, proficiency: skill.proficiency },
      });
    }
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Delete Skill
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const deletedSkill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user.uid }); // ✅ use uid
    if (deletedSkill) {
      await Activity.create({
        user: req.user.uid,
        category: "skills",
        type: "skill_deleted",
        title: `${deletedSkill.name} skill removed`,
        description: `You removed ${deletedSkill.name} from your skill list.`,
        metadata: { skillName: deletedSkill.name },
      });
    }
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
