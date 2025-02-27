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
        console.log("Subjects Before Parsing:", req.body.subjects);

        const { student, subjects, examType } = req.body;
        if (!student || !subjects || !examType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // ✅ Convert subjects properly to prevent issues
        const parsedSubjects = {};
        Object.keys(subjects).forEach(subject => {
            parsedSubjects[subject] = Number(subjects[subject]) || 0;
        });

        console.log("Subjects After Parsing:", parsedSubjects);

        // ✅ Calculate total marks & percentage
        const totalMarks = Object.values(parsedSubjects).reduce((acc, mark) => acc + mark, 0);
        console.log("Total Marks:", totalMarks);

        const percentage = (totalMarks / (Object.keys(parsedSubjects).length * 100)) * 100;
        console.log("Percentage:", percentage);

        let grade;
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else grade = 'F';

        const newMarks = new Marks({
            student,
            subjects: parsedSubjects,
            totalMarks,
            percentage,
            grade,
            examType
        });

        await newMarks.save();

        // ✅ Notify the student's parent
        const studentRecord = await Student.findById(student);
        if (studentRecord) {
            await new Notification({
                parentId: studentRecord.parentId,
                message: `New marks uploaded for ${examType}`,
            }).save();
        }

        console.log("✅ Marks Saved Successfully!");
        res.status(201).json({ message: "Marks added successfully", marks: newMarks });
    } catch (error) {
        console.error("🚨 Error in Marks API:", error);
        res.status(500).json({ message: "Error adding marks", error: error.message });
    }
});

module.exports = router;
