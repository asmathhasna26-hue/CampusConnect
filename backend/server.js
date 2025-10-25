import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ===== Import API Routes =====
import eventRoutes from "./routes/events.js";
import announcementRoutes from "./routes/announcements.js";
import facultyRoutes from "./routes/faculty.js";
import contactRoutes from "./routes/contact.js";

// Use API routes
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/contact", contactRoutes);

// ===== Serve Frontend =====
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve index.html for non-API routes (Express 5 compatible)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
