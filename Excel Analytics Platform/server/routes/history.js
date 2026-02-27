const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// History Schema
const historySchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const History = mongoose.model("History", historySchema);

// Save history
router.post("/", async (req, res) => {
  try {
    const { filename } = req.body;

    const newHistory = new History({ filename });
    await newHistory.save();

    res.status(201).json({ message: "History saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get history
router.get("/", async (req, res) => {
  try {
    const history = await History.find().sort({ uploadedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;