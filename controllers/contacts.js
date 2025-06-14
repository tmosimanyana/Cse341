// controllers/contacts.js
const Contact = require('../models/contact');

// GET /contacts
async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
}

// GET /contacts/:id
async function getContactById(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    // Handles invalid ObjectId
    res.status(400).json({ message: 'Invalid contact ID' });
  }
}

module.exports = {
  getAllContacts,
  getContactById
};

