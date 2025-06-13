// config/db.js
const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the given URI.
 * @param {string} uri - The MongoDB connection string.
 */
const connectDB = async (uri) => {
  try {
    if (!uri) {
      throw new Error('📡 MongoDB connection URI not defined');
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('🔴 MongoDB connection error:', err);
    // NOTE: Do NOT exit the process here; let Express stay up for routing tests
  }
};

module.exports = connectDB;

