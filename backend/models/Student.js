const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  class: String,
  section: String,
  parentName: String,
  parentContact: String,
  alternateContact: String,
  address: String,
  photoUrl: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Student', studentSchema);