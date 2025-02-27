const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Mark Attendance (POST)
router.post("/mark", authMiddleware, async (req, res) => {
  try {
    const { date, records } = req.body;
    const teacherId = req.user._id;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const attendanceRecords = records.map((record) => ({
      date,
      studentId: record.studentId,
      present: record.present,
      teacherId,
    }));

    await Attendance.insertMany(attendanceRecords);

    // Save notification
    const notification = new Notification({
      message: `Attendance marked for ${date}`,
    });
    await notification.save();

    res.status(201).json({ message: "Attendance recorded successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get Attendance by Date (GET)
router.get("/child", authMiddleware, async (req, res) => {
  try {
    const parentId = req.user._id;
    const child = await Student.findOne({ parentId });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const attendanceRecords = await Attendance.find({ studentId: child._id })
      .populate("studentId", "name rollNo")
      .sort({ date: -1 });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found for your child" });
    }
    
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
});

module.exports = router;
