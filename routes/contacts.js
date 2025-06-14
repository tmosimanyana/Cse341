// routes/contacts.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contacts');

// W01 Required Endpoints Only
router.get('/', ctrl.getAllContacts);
router.get('/:id', ctrl.getContactById);

// The following will be added in W02:
// router.post('/', ctrl.createContact);
// router.put('/:id', ctrl.updateContact);
// router.delete('/:id', ctrl.deleteContact);

module.exports = router;

