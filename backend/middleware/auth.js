const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');  // Use the same secret key
    req.user = decoded;  // Add user info to request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;