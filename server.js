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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/', protectedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});