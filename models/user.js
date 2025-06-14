const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: String,
  email: { type: String, lowercase: true }
});

module.exports = mongoose.model('User', userSchema);

