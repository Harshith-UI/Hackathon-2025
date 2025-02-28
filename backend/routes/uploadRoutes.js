const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// ✅ Configure Multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "answer-scripts", // Cloudinary folder name
    allowedFormats: ["jpg", "png", "jpeg", "pdf"],
  },
});

const upload = multer({ storage });

// ✅ Upload Route
router.post("/upload-cloudinary", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({ url: req.file.path });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports = router;
