// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('./models/contact');
const contacts = require('./data/contacts.json');

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await Contact.deleteMany({});
    console.log('Cleared contacts collection');

    await Contact.insertMany(contacts);
    console.log(`Imported ${contacts.length} contacts!`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();

