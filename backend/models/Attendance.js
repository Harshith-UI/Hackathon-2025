const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String, // Store in "DD-MM-YY" format
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  present: {
    type: Boolean,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Changed from "Teacher" to "User" if teachers are stored as Users
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
