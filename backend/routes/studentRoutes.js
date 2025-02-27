const express = require('express');
const Student = require('../models/Student');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

module.exports = router;