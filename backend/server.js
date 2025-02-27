const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");  // ✅ Added
const assignmentRoutes = require("./routes/assignmentRoutes");  // ✅ Added
const notificationRoutes = require("./routes/notificationRoutes");
const geminiRoutes = require("./routes/geminiRoutes"); 
const eventRoutes = require("./routes/eventsRoutes");  // ✅ Added Events Route

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded assignment files statically
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);  // ✅ Added route
app.use("/api/assignments", assignmentRoutes);  // ✅ Added route
app.use("/api/notifications", notificationRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/events", eventRoutes);  // ✅ Registered Events Route

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
