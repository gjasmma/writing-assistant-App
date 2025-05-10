const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');  // Install this package using npm install node-fetch

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

const protect = require('./middleware/auth');

// Example of a protected route
app.post('/api/save-text', protect, (req, res) => {
  // Only accessible if the user is logged in (JWT is valid)
  const userId = req.user.id;
  const { text } = req.body;

  // Save text to the database (or perform any other action)
  res.json({ message: `Text saved successfully for user ${userId}` });
});


// Route for checking text
app.post('/api/check-text', async (req, res) => {
  const { text } = req.body;

  // Check if the text is empty
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required.' });
  }

  // LanguageTool API call for grammar/style check
  try {
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text,  // Text from the frontend
        language: 'en-US'
      })
    });

    const data = await response.json();

    // Process and format the suggestions
    const suggestions = data.matches.map(match => `${match.message} (at position: ${match.offset})`).join('\n');


// server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env file

const app = express();
app.use(express.json()); // to parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Your routes and middlewares
const authRoutes = require('./routes/auth');
const writingRoutes = require('./routes/writing');
app.use('/api/auth', authRoutes);
app.use('/api/writing', writingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


    // Return suggestions back to frontend
    return res.json({ suggestions: suggestions || 'No issues found!' });

  } catch (error) {
    console.error('Error while checking text:', error);
    return res.status(500).json({ error: 'Something went wrong with the grammar check.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});