const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contacts');

// (Later we’ll add validation middleware here)

router.get('/', ctrl.getAllContacts);
router.get('/:id', ctrl.getContactById);
router.post('/', ctrl.createContact);
router.put('/:id', ctrl.updateContact);
router.delete('/:id', ctrl.deleteContact);

module.exports = router;

