const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Routes
const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

app.get('/', (req, res) => {
  res.send('Contacts API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
