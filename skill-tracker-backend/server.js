// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// --- API ROUTES (mount BEFORE any static / catch-all) ---
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/templates", templateRoutes);

// Quick health route
app.get("/api/health", (req, res) => res.json({ ok: true, time: Date.now() }));

// Serve frontend build only if requested (do this AFTER API routes)
if (process.env.SERVE_CLIENT === "true") {
  const clientBuild = path.join(__dirname, "../skill-tracker-frontend/dist");
  app.use(express.static(clientBuild));
  app.get("*", (req, res) =>
    res.sendFile(path.join(clientBuild, "index.html"))
  );
}

// Fallback for unmatched /api routes -> JSON 404
app.use("/api", (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error in request:", err?.stack || err);
  res.status(500).json({ message: "Server error" });
});

// Connect to Mongo and start server
mongoose
  .connect(process.env.MONGO_URI, {
    // options left as-is; adjust if using Mongoose v7+ deprecations
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default app;
