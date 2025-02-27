const express = require("express");
const router = express.Router();
const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");
const teacherOnly = require("../middleware/teacherOnly");

// ✅ POST: Add or Update Marks for a Student
router.post('/add', authMiddleware, teacherOnly, async (req, res) => {
    try {
        console.log("📌 Received Marks Data:", req.body);

        const { student, subjects, examType } = req.body;
        if (!student || !subjects || !examType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        console.log("Subjects Before Processing:", subjects);

        // ✅ Only allow the required 4 subjects & convert to numbers
        const validSubjects = ['English', 'Mathematics', 'Science', 'SocialStudies'];
        const parsedSubjects = {};
        validSubjects.forEach(subject => {
            parsedSubjects[subject] = Number(subjects[subject]) || 0;  // Ensure numeric values
        });

        console.log("Subjects After Processing:", parsedSubjects);

        // ✅ Calculate total marks & percentage correctly
        const totalMarks = Object.values(parsedSubjects).reduce((acc, mark) => acc + mark, 0);
        console.log("Total Marks Calculated:", totalMarks);

        const percentage = (totalMarks / (validSubjects.length * 100)) * 100;
        console.log("Percentage Calculated:", percentage);

        let grade;
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else grade = 'F';

        // ✅ Check if marks already exist for this student & examType
        let existingMarks = await Marks.findOne({ student, examType });

        if (existingMarks) {
            // ✅ Update the existing record
            existingMarks.subjects = parsedSubjects;
            existingMarks.totalMarks = totalMarks;
            existingMarks.percentage = percentage;
            existingMarks.grade = grade;
            await existingMarks.save();
            console.log("✅ Marks Updated Successfully!");
        } else {
            // ✅ Create a new record if no existing marks found
            existingMarks = new Marks({
                student,
                subjects: parsedSubjects,
                totalMarks,
                percentage,
                grade,
                examType
            });
            await existingMarks.save();
            console.log("✅ Marks Added Successfully!");
        }

        // ✅ Notify the student's parent
        const studentRecord = await Student.findById(student);
        if (studentRecord) {
            await new Notification({
                parentId: studentRecord.parentId,
                message: `New marks uploaded for ${examType}`,
            }).save();
        }

        res.status(201).json({ message: "Marks added/updated successfully", marks: existingMarks });
    } catch (error) {
        console.error("🚨 Error in Marks API:", error);
        res.status(500).json({ message: "Error adding/updating marks", error: error.message });
    }
});

// ✅ GET: Parent Fetching Marks
router.get("/exam/:examType", authMiddleware, async (req, res) => {
    try {
        const { examType } = req.params;
        console.log("📌 Fetching Marks for Exam Type:", examType);

        // ✅ Ensure only parents can access this route
        if (req.user.role !== "parent") {
            return res.status(403).json({ message: "Access denied. Only parents can view this data." });
        }

        // ✅ Find student linked to the parent
        const student = await Student.findOne({ parentId: req.user._id });

        if (!student) {
            console.log("🚨 No student linked to this parent.");
            return res.status(404).json({ message: "No student linked to this parent." });
        }

        // ✅ Fetch marks for the student based on the exam type
        const marks = await Marks.findOne({ student: student._id, examType: examType })
            .select("subjects totalMarks percentage grade examType date")
            .populate("student", "name rollNo class section");

        if (!marks) {
            console.log("🚨 No marks found for this student in", examType);
            return res.status(200).json([]);  // ✅ Return empty array instead of 404
        }

        console.log("✅ Marks Found:", marks);
        res.status(200).json(marks);
    } catch (error) {
        console.error("🚨 Error fetching marks:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
