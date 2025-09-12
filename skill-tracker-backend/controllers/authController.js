import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ===================
// Register (Email/Password)
// ===================
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, uid } = req.body;

    if (!firstName || !lastName || !email || !password || !uid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      uid,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================
// Google Sign-In
// ===================
export const googleSignIn = async (req, res) => {
  try {
    const { firstName, lastName, email, uid } = req.body;

    if (!firstName || !lastName || !email || !uid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        firstName,
        lastName,
        email,
        uid,
      });
      await user.save();
    }

    res.status(200).json({ message: "Google sign-in successful", user });
  } catch (err) {
    console.error("Google sign-in error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================
// Login
// ===================
export const login = async (req, res) => {
  try {
    const { email, uid } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ message: "Email and UID are required" });
    }

    // Try to find existing user by email
    let user = await User.findOne({ email });

    // If no user, create a minimal valid user (safe defaults)
    if (!user) {
      const localPart = String(email).split("@")[0] || "user";
      const parts = localPart.split(/[._\-]/).filter(Boolean);
      const firstName = parts[0]
        ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
        : "User";
      const lastName = parts.slice(1).join(" ") || " ";

      user = new User({
        firstName,
        lastName,
        email,
        uid,
      });

      await user.save();
      return res
        .status(201)
        .json({ message: "User created and logged in", user });
    }

    // If user exists but uid missing/different, update it
    if (!user.uid || user.uid !== uid) {
      user.uid = uid;
      await user.save();
    }

    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================
// Get Current User (/me)
// ===================
export const getMe = async (req, res) => {
  try {
    // Accept UID from several sources to avoid 401/404 when auth middleware isn't present
    const uidFromReqUser = req.user?.id || req.user?.uid;
    const uidFromQuery = req.query?.uid;
    const uidFromHeader = req.headers["x-user-uid"];
    const authHeader = req.headers["authorization"] || "";
    const uidFromBearer = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "").trim()
      : null;

    const uid =
      uidFromReqUser || uidFromQuery || uidFromHeader || uidFromBearer;

    if (!uid) {
      // return 400 instead of 401 so frontend can retry by sending uid
      return res.status(400).json({
        message:
          "UID not provided. Provide UID via req.user, query (?uid=...), header 'x-user-uid' or Authorization: Bearer <uid>",
      });
    }

    // Look up the full user from MongoDB using uid
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
