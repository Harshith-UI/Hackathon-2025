const express = require("express");
const multer = require("multer");
const path = require("path");
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");
const Student = require("../models/Student");
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

// ✅ Upload assignment
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {
        console.log("📌 Received Assignment Data:", req.body);
        console.log("📌 Uploaded File:", req.file);

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { title, dueDate } = req.body;
        if (!title || !dueDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newAssignment = new Assignment({
            title,
            fileUrl: `/uploads/${req.file.filename}`,
            teacherId: req.user.id,
            dueDate: new Date(dueDate),
        });

        await newAssignment.save();

        // ✅ Notify all parents
        const parents = await Student.distinct("parentId");
        for (const parentId of parents) {
            await new Notification({
                parentId,
                message: `New assignment uploaded: ${title}`,
            }).save();
        }

        res.status(201).json({ message: "Assignment uploaded successfully", assignment: newAssignment });
    } catch (error) {
        console.error("🚨 Error in Assignment API:", error);
        res.status(500).json({ message: "Error uploading assignment", error });
    }
});

module.exports = router;
