require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models
const Task = require("./models/Task");
const Session = require("./models/Session");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "FocusTools API",
    status: "Running",
    endpoints: {
      tasks: "/api/tasks",
      sessions: "/api/sessions",
    },
  });
});


// POST /api/tasks
app.post("/api/tasks", async (req, res) => {
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
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ message: error.message });
  }
})
// GET /api/tasks/:id
app.get("/api/tasks/:id", async (req, res) => {
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
app.put("/api/tasks/:id", async (req, res) => {
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
app.delete("/api/tasks/:id", async (req, res) => {
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

// TODO: Add your Session routes here
// POST /api/sessions
// GET /api/sessions

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
