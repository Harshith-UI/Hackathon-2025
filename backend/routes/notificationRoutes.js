const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// Fetch all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

module.exports = router;
