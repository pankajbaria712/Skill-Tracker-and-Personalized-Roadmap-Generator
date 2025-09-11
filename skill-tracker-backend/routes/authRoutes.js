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

// If client provides uid via query/header, call getMe directly.
// Otherwise run authMiddleware to populate req.user then call getMe.
router.get("/me", (req, res, next) => {
  if (req.query?.uid || req.headers["x-user-uid"]) {
    return getMe(req, res);
  }
  // call authMiddleware and then getMe
  return authMiddleware(req, res, () => getMe(req, res));
});

export default router;
