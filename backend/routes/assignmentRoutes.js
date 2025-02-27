const express = require("express");
const multer = require("multer");
const path = require("path");
const Assignment = require("../models/Assignment");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Upload assignment
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { title, dueDate } = req.body;

        const newAssignment = new Assignment({
            title,
            fileUrl: `/uploads/${req.file.filename}`,
            teacherId: req.user.id,
            dueDate: new Date(dueDate), // Ensure date format is stored correctly
        });

        await newAssignment.save();
        res.status(201).json({ message: "Assignment uploaded successfully", assignment: newAssignment });
    } catch (error) {
        res.status(500).json({ message: "Error uploading assignment", error });
    }
});

// Get all assignments
router.get("/", verifyToken, async (req, res) => {
    try {
        const assignments = await Assignment.find().populate("teacherId", "name email");
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching assignments", error });
    }
});

module.exports = router;
