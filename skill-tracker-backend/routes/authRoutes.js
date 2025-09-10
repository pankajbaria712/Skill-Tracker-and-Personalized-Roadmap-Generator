import express from "express";
import {
  register,
  googleSignIn,
  login,
  getMe,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/google", googleSignIn);
router.post("/login", login);

// ✅ New protected route
router.get("/me", authMiddleware, getMe);

export default router;
