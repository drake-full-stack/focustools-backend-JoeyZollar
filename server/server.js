import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Routes
app.use("/api/tasks", taskRoutes);

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

// Session routes
// POST /api/sessions
app.post("/api/sessions", async (req, res) => {
  try {
    // Create new session from request body
    const newSession = new Session(req.body);

    // Save to database
    const savedSession = await newSession.save();

    // Send back the saved book
    res.status(201).json(savedSession);
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ message: error.message });
  }
});
// GET /api/sessions
app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await Session.find().populate('taskId');
    res.json(sessions);
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ message: error.message });
  }
})

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
