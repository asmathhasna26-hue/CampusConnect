import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

/**
 * @route   GET /api/announcements
 * @desc    Get all announcements
 */
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcements", error: err.message });
  }
});

/**
 * @route   POST /api/announcements
 * @desc    Add a new announcement
 */
router.post("/", async (req, res) => {
  try {
    const newAnn = new Announcement(req.body);
    await newAnn.save();
    res.status(201).json(newAnn);
  } catch (err) {
    res.status(400).json({ message: "Error creating announcement", error: err.message });
  }
});

/**
 * @route   DELETE /api/announcements/:id
 * @desc    Delete an announcement
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedAnn = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnn)
      return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting announcement", error: err.message });
  }
});

export default router;
