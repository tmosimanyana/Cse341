const Contact = require('../models/contact');

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch {
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json(contact);
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Invalid contact ID' });
  }
};

exports.createContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch {
    res.status(400).json({ message: 'Invalid contact data' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json(updated);
  } catch {
    res.status(400).json({ message: 'Invalid update data' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Invalid contact ID' });
  }
};
