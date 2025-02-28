const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to Student collection
        required: true
    },
    subjects: {
        English: { type: Number, required: true },
        Mathematics: { type: Number, required: true },
        Science: { type: Number, required: true },
        SocialStudies: { type: Number, required: true },
    },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    examType: { type: String, enum: ['Midterm', 'Final', 'Unit Test'], required: true },
    date: { type: Date, default: Date.now },

    // ✅ NEW FIELD: Answer Script URLs
    answerScripts: {
        English: { type: String, default: null }, // URL for English Answer Script
        Mathematics: { type: String, default: null }, // URL for Mathematics Answer Script
        Science: { type: String, default: null }, // URL for Science Answer Script
        SocialStudies: { type: String, default: null } // URL for Social Studies Answer Script
    }
});

module.exports = mongoose.model('Marks', MarksSchema);
