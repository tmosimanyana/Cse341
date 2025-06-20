// File: server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

dotenv.config();
require('./config/passport-config');

const app = express();
const PORT = process.env.PORT || 8080;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Root route for homepage or OAuth entry
app.get('/', (req, res) => {
  res.send(
    `<h1>Welcome to the Protected API</h1>
     <p><a href="/google">Login with Google</a></p>`
  );
});

// Authentication and protected routes
app.use('/', authRoutes);
app.use('/', protectedRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

