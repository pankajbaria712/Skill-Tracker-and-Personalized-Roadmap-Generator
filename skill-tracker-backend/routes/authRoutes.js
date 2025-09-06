import express from "express";
import {
  register,
  googleSignIn,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/google", googleSignIn);
router.post("/login", login); // New login route

// Protected profile routes

export default router;
