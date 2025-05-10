// models/Text.js
const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model
    },
    originalText: {
        type: String,
        required: true,
    },
    improvedText: {
        type: String,
        default: null, // Can be updated if the text is improved
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Text', textSchema);