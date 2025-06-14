const router = require('express').Router();
const passport = require('passport');

// Initiate OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/auth/success');
  }
);

// Success page (you can show user info)
router.get('/success', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.json({ message: 'Logged in', user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => res.json({ message: 'Logged out' }));
});

module.exports = router;

