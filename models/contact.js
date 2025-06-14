// models/contact.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  label: String,
  address: { type: String, lowercase: true, trim: true, match: [/.+@.+\..+/, 'Invalid email'] }
}, { _id: false });

const phoneSchema = new mongoose.Schema({
  label: String,
  number: { type: String, trim: true }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  firstName:    { type: String, trim: true },
  middleName:   { type: String, trim: true, default: null },
  lastName:     { type: String, trim: true, default: null },
  nickname:     { type: String, trim: true, default: null },
  name:         { type: String, trim: true, required: true },
  emails:       { type: [emailSchema], default: [] },
  phones:       { type: [phoneSchema], default: [] },
  address:      { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);

