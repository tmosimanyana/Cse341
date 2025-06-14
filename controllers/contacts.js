// controllers/contacts.js
const Contact = require('../models/contact');

// GET /contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
};

// GET /contacts/:id
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (err) {
    console.error(err);
    // Invalid ObjectId → 400, other errors → 500
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Error fetching contact' });
  }
};

// POST /contacts
exports.createContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    // Mongoose validation errors → 400
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

// PUT /contacts/:id
exports.updateContact = async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    const status = err.name === 'ValidationError' || err.kind === 'ObjectId'
      ? 400
      : 500;
    res.status(status).json({ message: err.message });
  }
};

// DELETE /contacts/:id
exports.deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    console.error(err);
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Error deleting contact' });
  }
};

exports.createContact = async (req, res) => {
  try {
    console.log('📥 Incoming Contact Data:', req.body); // ← Add this
    const newContact = new Contact(req.body);
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Create Contact Error:', err); // ← Add this
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};
