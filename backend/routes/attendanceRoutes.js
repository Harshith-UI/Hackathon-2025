const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Notification = require("../models/Notification"); // ✅ Import Notification model
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import middleware

const router = express.Router();

// ✅ Mark Attendance (POST) - Now sends a notification to the parent
router.post("/mark", authMiddleware, async (req, res) => {
  try {
    console.log("📌 Received attendance data:", req.body);

    const { date, records } = req.body;
    const teacherId = req.user._id; // ✅ Get teacherId from authentication

    if (!date || !records || !Array.isArray(records)) {
      console.log("Invalid data:", { date, records });
      return res.status(400).json({ message: "Invalid data provided" });
    }

    // ✅ Store attendance for each student and send notifications
    const attendanceRecords = [];

    for (const record of records) {
      const student = await Student.findById(record.studentId).populate("parentId");

      if (!student) {
        console.log(`Student ID ${record.studentId} not found.`);
        continue;
      }

      // Save attendance record
      attendanceRecords.push({
        date,
        studentId: record.studentId,
        present: record.present,
        teacherId,
      });

      // ✅ Create a notification for the parent
      const notification = new Notification({
        parentId: student.parentId._id,
        message: `${student.name} is marked as ${record.present ? "Present" : "Absent"} on ${date}.`,
      });

      await notification.save(); // ✅ Save notification in database
    }

    console.log("📌 Saving attendance records to database:", attendanceRecords);
    await Attendance.insertMany(attendanceRecords);

    res.status(201).json({ message: "Attendance recorded and notifications sent successfully." });

  } catch (error) {
    console.error("🚨 Error in attendance route:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get Attendance by Date (Parent Viewing Child's Attendance)
router.get("/child", authMiddleware, async (req, res) => {
  try {
    const parentId = req.user._id;

    // ✅ Find the parent's child
    const child = await Student.findOne({ parentId });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // ✅ Find attendance for the child
    const attendanceRecords = await Attendance.find({ studentId: child._id })
      .populate("studentId", "name rollNo")
      .sort({ date: -1 });

    if (!attendanceRecords.length) {
      return res.status(200).json([]);  // ✅ Return empty array if no attendance found
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("🚨 Error fetching child attendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
});

// ✅ Get Attendance for a Specific Date (Chatbot API)
router.get("/chatbot/attendance", authMiddleware, async (req, res) => {
  try {
    const parentId = req.user._id;
    const { date } = req.query; // ✅ Chatbot will send a date as a query param

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    // ✅ Find the parent's child
    const child = await Student.findOne({ parentId });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // ✅ Fetch attendance for the given date
    const attendanceRecord = await Attendance.findOne({ studentId: child._id, date });

    if (!attendanceRecord) {
      return res.status(404).json({ message: `No attendance record found for ${date}.` });
    }

    // ✅ Chatbot Friendly Response
    const response = {
      message: `Your child's attendance on ${date} was ${attendanceRecord.present ? "Present" : "Absent"}.`
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("🚨 Error fetching chatbot attendance:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

module.exports = router;
