const mongoose = require('mongoose');

// MongoDB URI
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/writing-assistant', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;