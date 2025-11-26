import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    // Create new task from request body
    const newTask = new Task(req.body);

    // Save to database
    const savedTask = await newTask.save();

    // Send back the saved book
    res.status(201).json(savedTask);
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ message: error.message });
  }
});
// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ message: error.message });
  }
})
// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.json(task);
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ message: error.message });
  }
})
// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, // Which task to update
      req.body, // New data
      {
        new: true, // Return updated version
        runValidators: true, // Check schema rules
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
   try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id,);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
      book: deletedTask,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;