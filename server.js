require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');
require('./config/passport'); // Import Passport OAuth strategies and config

// Initialize app
const app = express();

// --- 1) Global Logging Middleware ---
app.use((req, res, next) => {
  console.log(new Date().toISOString(), '→', req.method, req.originalUrl);
  next();
});

// --- 2) Built-in Middleware ---
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*', // Adjust for your frontend origin
  credentials: true // Allow cookies to be sent cross-origin if needed
}));
app.use(express.json());

// --- 3) Session & Passport Middleware ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// --- 4) DB Connection ---
const targetUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
console.log('🔍 Using MongoDB URI:', targetUri);
if (!targetUri) {
  console.error('🔴 MongoDB URI missing. Set MONGODB_URI or DATABASE_URL.');
  process.exit(1);
}
connectDB(targetUri);

// --- 5) Mount API Routers ---
const contactsRouter = require('./routes/contacts');
const productsRouter = require('./routes/products');
app.use('/contacts', contactsRouter);
app.use('/products', productsRouter);

// --- 6) Auth Routes ---
app.get('/auth/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login redirect
    res.redirect('/'); 
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

// --- 7) Swagger ---
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// --- 8) Health Check & 404 Handler ---
app.get('/', (req, res) => res.send('✅ API is live!'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// --- 9) Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

