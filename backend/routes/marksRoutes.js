const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');
const Student= require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure only teachers can add marks
const teacherOnly = require('../middleware/teacherOnly');
// POST: Add Marks for a Student
router.post('/add', authMiddleware, teacherOnly, async (req, res) => {
    try {
        const { student, subjects, examType } = req.body;

        // Calculate total marks and percentage
        const totalMarks = Object.values(subjects).reduce((acc, mark) => parseInt(acc) + parseInt(mark), 0);
        const percentage = (totalMarks / (Object.keys(subjects).length * 100)) * 100;
        
        // Assign Grade based on percentage
        let grade;
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else grade = 'F';

        const newMarks = new Marks({
            student,
            subjects,
            totalMarks,
            percentage,
            grade,
            examType
        });

        await newMarks.save();
        res.status(201).json({ message: 'Marks added successfully', marks: newMarks });
    } catch (error) {
        res.status(500).json({ message: 'Error adding marks', error: error.message });
    }
});

router.get("/exam/:examType", authMiddleware, async (req, res) => {
  try {
      const { examType } = req.params;
      console.log(examType);
    // Ensure only parents can access this route
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Access denied. Only parents can view this data." });
    }

    // Find the student(s) linked to the parent
      const student = await Student.findOne({ parentName: req.user.name });
      console.log(student);

    if (!student) {
      return res.status(404).json({ message: "No student linked to this parent." });
    }

    // Fetch the marks for the student based on the exam type
    const marks = await Marks.findOne({ student: student._id, examType: examType }).populate("student", "name rollNo class section");
      // console.log(marks);
    if (!marks) {
      return res.status(200).json({ message: "No marks found for this exam type." });
    }

    res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
