import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

/**
 * @route   GET /api/events
 * @desc    Get all events
 */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
});

/**
 * @route   POST /api/events
 * @desc    Add a new event
 */
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: "Error creating event", error: err.message });
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event", error: err.message });
  }
});

export default router;
