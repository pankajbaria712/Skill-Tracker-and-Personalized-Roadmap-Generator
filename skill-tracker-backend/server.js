import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // <-- Added

import authRoutes from "./routes/authRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";

dotenv.config();

const app = express();

// Enable CORS so React frontend can access backend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillsRoutes);

const PORT = process.env.PORT || 5000; // fallback to 5000 if not set
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
