const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");  // ✅ Added
const assignmentRoutes = require("./routes/assignmentRoutes");
const queryRoutes = require("./routes/queryRoutes"); // ✅ Added
const notificationRoutes = require("./routes/notificationRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const eventRoutes = require("./routes/eventsRoutes");  // ✅ Added Events Route
const uploadRoutes = require("./routes/uploadRoute"); ✅ (Singular)// ✅ S3 Upload Route

const app = express();
const PORT = process.env.PORT || 5002;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded assignment files statically
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoutes);  // ✅ S3 Upload Route

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
