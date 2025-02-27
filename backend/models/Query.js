const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentName: { type: String, required: true }, // ✅ Store parent name
  childName: { type: String, required: true }, // ✅ Store child's name
  question: { type: String, required: true },
  answer: { type: String, default: null }, // Teacher's response
  status: { type: String, enum: ["unsolved", "solved"], default: "unsolved" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Query", querySchema);