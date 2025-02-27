const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import middleware

const router = express.Router();

// ✅ Mark Attendance (POST)
router.post("/mark", authMiddleware, async (req, res) => {
  try {
    console.log("Received attendance data:", req.body);

    const { date, records } = req.body;
    const teacherId = req.user._id; // ✅ Ensured `teacherId` is fetched correctly

    if (!date || !records || !Array.isArray(records)) {
      console.log("Invalid data:", { date, records });
      return res.status(400).json({ message: "Invalid data provided" });
    }

    // Store attendance for each student
    const attendanceRecords = records.map((record) => ({
      date,
      studentId: record.studentId,
      present: record.present,
      teacherId,
    }));

    // console.log("Saving to database:", attendanceRecords);
    await Attendance.insertMany(attendanceRecords);

    res.status(201).json({ message: "Attendance recorded successfully" });

  } catch (error) {
    console.error("Error in attendance route:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get Attendance by Date (GET)
router.get("/child", authMiddleware, async (req, res) => {
  try {
    const parentId = req.user._id;

    // Find the parent's child
    const child = await Student.findOne({ parentId });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // Find attendance for the child
    const attendanceRecords = await Attendance.find({ studentId: child._id })
      .populate("studentId", "name rollNo")
      .sort({ date: -1 });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found for your child" });
    }
    console.log(attendanceRecords);
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching child attendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
});


module.exports = router;
