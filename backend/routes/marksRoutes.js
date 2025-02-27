const express = require("express");
const router = express.Router();
const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");
const teacherOnly = require("../middleware/teacherOnly");

// ✅ POST: Add Marks for a Student
router.post('/add', authMiddleware, teacherOnly, async (req, res) => {
    try {
        console.log("📌 Received Marks Data:", req.body);

        const { student, subjects, examType } = req.body;
        if (!student || !subjects || !examType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // ✅ Ensure only 4 required subjects are processed
        const { English, Mathematics, Science, SocialStudies } = subjects;

        if (
            English === undefined ||
            Mathematics === undefined ||
            Science === undefined ||
            SocialStudies === undefined
        ) {
            return res.status(400).json({ message: "All 4 subjects (English, Mathematics, Science, SocialStudies) are required." });
        }

        // ✅ Calculate total marks, percentage & grade
        const totalMarks = parseInt(English) + parseInt(Mathematics) + parseInt(Science) + parseInt(SocialStudies);
        const percentage = (totalMarks / 400) * 100; // 4 subjects, max 100 each

        let grade;
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else grade = 'F';

        const newMarks = new Marks({
            student,
            subjects: { English, Mathematics, Science, SocialStudies },
            totalMarks,
            percentage,
            grade,
            examType
        });

        await newMarks.save();

        // ✅ Fetch the student's parentId and notify them
        const studentRecord = await Student.findById(student);
        if (studentRecord) {
            await new Notification({
                parentId: studentRecord.parentId,
                message: `New marks uploaded for ${examType}. Check the Parent Dashboard.`,
            }).save();
        }

        res.status(201).json({ message: "Marks added successfully", marks: newMarks });
    } catch (error) {
        console.error("🚨 Error in Marks API:", error);
        res.status(500).json({ message: "Error adding marks", error: error.message });
    }
});

// ✅ GET: Parent Fetching Marks
router.get("/exam/:examType", authMiddleware, async (req, res) => {
    try {
        const { examType } = req.params;

        // ✅ Ensure only parents can access this route
        if (req.user.role !== "parent") {
            return res.status(403).json({ message: "Access denied. Only parents can view this data." });
        }

        // ✅ Find student linked to the parent
        const student = await Student.findOne({ parentId: req.user._id });

        if (!student) {
            return res.status(404).json({ message: "No student linked to this parent." });
        }

        // ✅ Fetch marks for the student based on the exam type
        const marks = await Marks.findOne({ student: student._id, examType: examType })
            .select("subjects totalMarks percentage grade examType date") // Fetch only required fields
            .populate("student", "name rollNo class section");

        if (!marks) {
            return res.status(200).json([]);  // ✅ Return empty array instead of 404
        }

        res.status(200).json(marks);
    } catch (error) {
        console.error("🚨 Error fetching marks:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
