// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js"; // ✅ added

dotenv.config();

const app = express();
app.use(cors());
// increase body size limit for AI content
app.use(express.json({ limit: "2mb" }));

// Simple request logger (debugging only)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    try {
      console.log("  Body:", JSON.stringify(req.body));
    } catch {
      console.log("  Body: <unavailable or parse error>");
    }
  }
  next();
});

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => res.send("Skill Tracker backend is running"));
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/roadmaps", roadmapRoutes); // ✅ added

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error in request:", err?.stack || err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ✅ Process-level handlers
process.on("uncaughtException", (err) => {
  console.error("UncaughtException:", err?.stack || err);
});
process.on("unhandledRejection", (reason) => {
  console.error("UnhandledRejection:", reason);
});

export default server;
