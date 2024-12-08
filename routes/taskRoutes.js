const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// Create task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ title, description, user: req.user.id });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err });
  }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err });
  }
});

module.exports = router;
