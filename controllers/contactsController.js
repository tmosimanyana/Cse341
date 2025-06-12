const Contact = require('../models/contact');

const getAll = async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
};

const getSingle = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.status(200).json(contact);
};

const createContact = async (req, res) => {
  const contact = new Contact(req.body);
  const savedContact = await contact.save();
  res.status(201).json(savedContact);
};

const updateContact = async (req, res) => {
  const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: 'Contact not found' });
  res.status(204).send();
};

const deleteContact = async (req, res) => {
  const deleted = await Contact.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Contact not found' });
  res.status(200).json({ message: 'Contact deleted' });
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
