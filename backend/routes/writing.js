const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Text = require('../models/Text'); // MongoDB model to save text
const axios = require('axios'); // To send API requests for grammar checking (like Grammarly)

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Store this securely in your .env

// Middleware to verify the JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
}

// Save text to the database
router.post('/save-text', authenticateToken, async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;  // Get user ID from token payload

    if (!text) {
        return res.status(400).json({ message: 'Text content is required.' });
    }

    try {
        const newText = new Text({
            userId,
            text,
            createdAt: new Date()
        });
        await newText.save();
        res.status(201).json({ message: 'Text saved successfully!' });
    } catch (error) {
        console.error('Error saving text:', error);
        res.status(500).json({ message: 'Failed to save text.' });
    }
});

// Improve text: Grammar and style checking (using an external API like Grammarly)
router.post('/improve-text', authenticateToken, async (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ message: 'Text content is required for improvement.' });
    }

    try {
        // Example: Use an external API (e.g., Grammarly or custom NLP service) for grammar check
        const response = await axios.post('https://api.grammarbot.io/v2/check', {
            text: text,
            language: 'en-US'
        });

        const suggestions = response.data.matches; // Assuming the response contains grammar suggestions

        // You can process the suggestions to improve the text here (e.g., replacing certain phrases or showing suggestions to the user)
        const improvedText = applySuggestions(text, suggestions);

        res.status(200).json({
            message: 'Text improvement successful.',
            originalText: text,
            improvedText: improvedText,
            suggestions: suggestions
        });
    } catch (error) {
        console.error('Error improving text:', error);
        res.status(500).json({ message: 'Failed to improve text.' });
    }
});

// Helper function to apply grammar suggestions
function applySuggestions(originalText, suggestions) {
    // Basic implementation: Here you can apply each suggestion to the text
    // You can improve this function to apply the suggestions more intelligently

    suggestions.forEach(suggestion => {
        const { replacement, offset, length } = suggestion;
        originalText = originalText.slice(0, offset) + replacement + originalText.slice(offset + length);
    });

    return originalText;
}

module.exports = router;