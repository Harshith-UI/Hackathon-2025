const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET - Fetch all notifications for logged-in parent
router.get("/", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ parentId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ DELETE - Clear all notifications for logged-in parent
router.delete("/clear", authMiddleware, async (req, res) => {
    try {
        await Notification.deleteMany({ parentId: req.user._id });
        res.status(200).json({ message: "All notifications cleared successfully" });
    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
