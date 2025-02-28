const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const router = express.Router();

// ✅ Configure AWS S3
const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

// ✅ Configure Multer for S3 Upload
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: "public-read", // 🔹 Allow public read access (optional)
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `answer-scripts/${Date.now()}-${file.originalname}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// ✅ Upload File Route
router.post("/upload-s3", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ url: req.file.location });
});

module.exports = router;
