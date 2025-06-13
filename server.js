require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// Use either MONGODB_URI or DATABASE_URL for compatibility
targetUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
if (!targetUri) {
  console.error('🔴 MongoDB connection URI not defined. Set MONGODB_URI or DATABASE_URL.');
  process.exit(1);
}
connectDB(targetUri);

// Routes('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Health check
app.get('/', (req, res) => {
  res.send('✅ Contacts & Products API is live!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

