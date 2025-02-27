const express = require('express');
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Proxy Route to Call Google Gemini API
router.post("/analyze", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // Store API key in .env

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }], // Correct payload format
      }
      );
      console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Gemini API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate analysis" });
  }
});

module.exports = router;
