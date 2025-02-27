const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');
  const isMatchRole = user.role === req.body.role;
  if(!isMatchRole) return res.status(400).send('Not the correct role');
  const isMatch = password === user.password;
  if (!isMatch) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});
router.get("/get-user-id", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    res.json({ userId: decoded.id });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});
module.exports = router;