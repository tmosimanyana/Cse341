const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/protected', isAuthenticated, (req, res) => {
  res.json({
    message: 'Welcome to the protected route!',
    user: req.user.displayName
  });
});

module.exports = router;