const express = require('express');
const router = express.Router();
const controller = require('../controllers/products');
const ensureAuth = require('../middleware/auth');

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.post('/', ensureAuth, controller.createProduct);
router.put('/:id', ensureAuth, controller.updateProduct);
router.delete('/:id', ensureAuth, controller.deleteProduct);

module.exports = router;

