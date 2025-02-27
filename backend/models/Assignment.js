const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }, // Upload date
    dueDate: { type: Date, required: true } // Due date for submission
});

module.exports = mongoose.model("Assignment", assignmentSchema);
