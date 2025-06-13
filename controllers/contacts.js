// controllers/contacts.js

const getAllContacts = (req, res) => {
  res.json([
    { name: "John Doe", email: "john@example.com", phone: "1234567890" },
    { name: "Jane Doe", email: "jane@example.com", phone: "9876543210" }
  ]);
};

const getContactById = (req, res) => {
  const contactId = req.params.id;
  res.json({ id: contactId, name: "John Doe", email: "john@example.com", phone: "1234567890" });
};

const createContact = (req, res) => {
  res.status(201).json({ message: "Contact created", contact: req.body });
};

const updateContact = (req, res) => {
  res.json({ message: `Contact ${req.params.id} updated`, contact: req.body });
};

const deleteContact = (req, res) => {
  res.json({ message: `Contact ${req.params.id} deleted` });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
