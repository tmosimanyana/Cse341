const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacts');
const ensureAuth = require('../middleware/auth');

router.get('/', controller.getAllContacts);
router.get('/:id', controller.getContactById);
router.post('/', ensureAuth, controller.createContact);
router.put('/:id', ensureAuth, controller.updateContact);
router.delete('/:id', ensureAuth, controller.deleteContact);

module.exports = router;

