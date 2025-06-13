// config/db.js
// Establishes a MongoDB connection using the provided URI without terminating the server on failure
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
    // Do NOT exit here—allow the server to stay up so we can test routing
  }
};

module.exports = connectDB;

