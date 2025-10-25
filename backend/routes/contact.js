import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 */
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

/**
 * @route   POST /api/contact
 * @desc    Send a new message
 */
router.post("/", async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(400).json({ message: "Error sending message", error: err.message });
  }
});

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete a message
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting message", error: err.message });
  }
});

export default router;
