const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['parent', 'teacher'] },
});

module.exports = mongoose.model('User', userSchema);