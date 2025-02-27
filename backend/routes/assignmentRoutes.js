const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Assignment = require("../models/Assignment");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Configure Multer Storage for Cloudinary (Images Only)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "assignments",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// ✅ Upload Assignment (Images Only)
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {
        console.log("📌 Request Body:", req.body);
        console.log("📌 Uploaded File:", req.file);

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { title, dueDate } = req.body;
        if (!title || !dueDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newAssignment = new Assignment({
            title,
            fileUrl: req.file.path, // ✅ Cloudinary URL
            teacherId: req.user.id,
            dueDate: new Date(dueDate),
        });

        await newAssignment.save();

        res.status(201).json({ message: "Assignment uploaded successfully", assignment: newAssignment });
    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Error uploading assignment", error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ dueDate: 1 });
        res.json(assignments);
    } catch (error) {
        console.error("🚨 Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

module.exports = router;