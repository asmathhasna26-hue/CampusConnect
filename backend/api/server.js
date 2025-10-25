import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import eventRoutes from "../backend/routes/events.js";
import announcementRoutes from "../backend/routes/announcements.js";
import facultyRoutes from "../backend/routes/faculty.js";
import contactRoutes from "../backend/routes/contact.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/contact", contactRoutes);

// Root (for testing)
app.get("/", (req, res) => {
  res.send("CampusConnect API is running 🚀");
});

// Export for Vercel
export default app;
