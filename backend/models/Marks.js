const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to Student collection
        required: true
    },
    subjects: {
        Telugu: { type: Number, required: true },
        Hindi: { type: Number, required: true },
        English: { type: Number, required: true },
        Mathematics: { type: Number, required: true },
        Science: { type: Number, required: true },
        Biology: { type: Number, required: true },
        SocialStudies: { type: Number, required: true },
    },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    examType: { type: String, enum: ['Midterm', 'Final', 'Unit Test'], required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marks', MarksSchema);
