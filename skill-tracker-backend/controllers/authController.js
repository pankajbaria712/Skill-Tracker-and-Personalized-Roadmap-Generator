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

    const user = await User.findOne({ email, uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
