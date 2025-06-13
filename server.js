require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// --- 1) Global Logging Middleware ---
app.use((req, res, next) => {
  console.log(new Date().toISOString(), '→', req.method, req.originalUrl);
  next();
});

// --- 2) Built‑in Middleware ---
app.use(cors());
app.use(express.json());

// --- 3) DB Connection ---
const targetUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
if (!targetUri) {
  console.error('🔴 MongoDB URI missing. Set MONGODB_URI or DATABASE_URL.');
  process.exit(1);
}
connectDB(targetUri);

// --- 4) Mount API Routers ---
const contactsRouter = require('./routes/contacts');
const productsRouter = require('./routes/products');
app.use('/contacts', contactsRouter);
app.use('/products', productsRouter);

// --- 5) Swagger ---
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// --- 6) Health Check & 404 Handler ---
app.get('/', (req, res) => res.send('✅ API is live!'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// --- 7) Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


