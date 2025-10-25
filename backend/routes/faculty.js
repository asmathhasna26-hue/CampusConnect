import express from "express";
import Faculty from "../models/Faculty.js";

const router = express.Router();

/**
 * @route   GET /api/faculty
 * @desc    Get all faculty members
 */
router.get("/", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Error fetching faculty", error: err.message });
  }
});

/**
 * @route   POST /api/faculty
 * @desc    Add new faculty member
 */
router.post("/", async (req, res) => {
  try {
    const newFaculty = new Faculty(req.body);
    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (err) {
    res.status(400).json({ message: "Error adding faculty", error: err.message });
  }
});

/**
 * @route   DELETE /api/faculty/:id
 * @desc    Delete faculty member
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Faculty.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting faculty", error: err.message });
  }
});

export default router;
