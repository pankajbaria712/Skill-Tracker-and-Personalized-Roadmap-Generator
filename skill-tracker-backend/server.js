import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
// increase body size a bit for safety and keep JSON parser
app.use(express.json({ limit: "1mb" }));

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  // log request body for POST/PUT to debug JSON parse/server errors (remove in production)
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    // try-catch in case body is not yet parsed
    try {
      console.log("  Body:", JSON.stringify(req.body));
    } catch (e) {
      console.log("  Body: <unavailable or parse error>");
    }
  }
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // don't crash here — but it helps to surface the issue
  });

// Routes
app.get("/", (req, res) => res.send("Skill Tracker backend is running"));
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillsRoutes);

// global error handler (will log stack)
app.use((err, req, res, next) => {
  console.error(
    "Unhandled error in request:",
    err && err.stack ? err.stack : err
  );
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// process level handlers for debugging
process.on("uncaughtException", (err) => {
  console.error("UncaughtException:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (reason) => {
  console.error("UnhandledRejection:", reason);
});

export default server;
