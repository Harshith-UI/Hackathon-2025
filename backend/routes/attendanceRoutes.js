const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Mark Attendance (POST)
router.post("/mark", authMiddleware, async (req, res) => {
    try {
        console.log("📌 Received Attendance Data:", req.body);

        const { date, records } = req.body;
        if (!date || !records || !Array.isArray(records)) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const attendanceRecords = records.map(record => ({
            date,
            studentId: record.studentId,
            present: record.present,
            teacherId: req.user._id,
        }));

        await Attendance.insertMany(attendanceRecords);

        // ✅ Save notifications for parents
        for (const record of records) {
            const studentRecord = await Student.findById(record.studentId);
            if (studentRecord) {
                await new Notification({
                    parentId: studentRecord.parentId,
                    message: `Attendance marked for ${studentRecord.name} on ${date}`,
                }).save();
            }
        }

        res.status(201).json({ message: "Attendance recorded successfully" });
    } catch (error) {
        console.error("🚨 Error in Attendance API:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
