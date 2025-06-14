const Contact = require('../models/contact');

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch {
    res.status(500).json({ message: 'Error fetching contacts' });
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
    const { firstName, lastName, email, birthday } = req.body;
    if (!firstName || !lastName || !email || !birthday) {
      return res.status(400).json({ message: 'Missing required contact fields' });
    }
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch {
    res.status(400).json({ message: 'Invalid contact data' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json(contact);
  } catch {
    res.status(400).json({ message: 'Invalid update data' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Invalid contact ID' });
  }
};