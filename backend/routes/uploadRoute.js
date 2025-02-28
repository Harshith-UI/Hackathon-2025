const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const router = express.Router();

// ✅ Configure AWS S3 Client (AWS SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ✅ Multer Setup (File Upload)
const storage = multer.memoryStorage(); // Stores files in memory before upload
const upload = multer({ storage });

// ✅ Upload File to S3 Route
router.post("/upload-s3", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileName = `answer-scripts/${Date.now()}-${req.file.originalname}`;

  // S3 Upload Configuration
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports = router;
