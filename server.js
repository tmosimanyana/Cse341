const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

require('./config/db')();

app.use('/contacts', require('./routes/contacts'));
app.use('/products', require('./routes/products'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => res.send('Contacts & Products API is live!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
