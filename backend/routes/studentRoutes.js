const express = require('express');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');  // Ensure authentication

const router = express.Router();

// ✅ Keep the existing API that fetches all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// ✅ Add a new API that fetches only the logged-in parent's child details
router.get('/child', authMiddleware, async (req, res) => {
  try {
    const parentId = req.user.id;  // Extract parent ID from auth token
    const child = await Student.findOne({ parentId });

    if (!child) {
      return res.status(404).json({ message: "No child found for this parent" });
    }

    res.json(child);
  } catch (error) {
    console.error("Error fetching child details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
