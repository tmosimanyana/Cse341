require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: 'http://localhost:3000',  // adjust to your frontend origin
  credentials: true,
}));

app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB client setup
const client = new MongoClient(process.env.MONGO_URI);

let usersCollection;

// Connect to MongoDB once on server start
async function connectDb() {
  try {
    await client.connect();
    const db = client.db('portfolio');
    usersCollection = db.collection('users');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
connectDb();

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user in MongoDB
    let user = await usersCollection.findOne({ googleId: profile.id });

    if (!user) {
      user = {
        googleId: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        photos: profile.photos,
      };
      await usersCollection.insertOne(user);
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersCollection.findOne({ googleId: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to Professional Portfolio API! <a href="/auth/google">Login with Google</a>');
});

// Start OAuth login flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Create JWT for the logged-in user
    const token = jwt.sign(
      { id: req.user.googleId, displayName: req.user.displayName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Send JWT token as response or redirect to frontend
    res.send(`
      <h1>Hello, ${req.user.displayName}!</h1>
      <p>Your JWT token:</p>
      <pre>${token}</pre>
      <p>Use this token to authenticate API requests.</p>
    `);
  }
);

// Protected API route example (verify JWT)
app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    res.json({ message: 'Protected profile data', user: decoded });
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

