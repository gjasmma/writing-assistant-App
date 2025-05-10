const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const user = new User({ username, email, password });
  await user.save();

  res.status(201).json({
    message: 'User registered successfully',
    username: user.username,
    email: user.email
  });
});

// Login user and generate JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Check if password is correct
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    'your_secret_key',  // Replace with a strong secret key
    { expiresIn: '1h' }  // Token expiration time
  );

  res.json({ token });
});

module.exports = router;