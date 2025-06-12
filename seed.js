const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contact = require('./models/contact');

dotenv.config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const results = [];

fs.createReadStream('contacts.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data['First Name'] && data['E-mail 1 - Value']) {
      results.push({
        firstName: data['First Name'] || 'N/A',
        lastName: data['Last Name'] || 'N/A',
        email: data['E-mail 1 - Value'] || 'noemail@example.com',
        favoriteColor: ['Red', 'Blue', 'Green', 'Yellow'][Math.floor(Math.random() * 4)],
        birthday: '2000-01-01',
      });
    }
  })
  .on('end', async () => {
    try {
      await Contact.deleteMany({});
      await Contact.insertMany(results);
      console.log('Contacts imported successfully!');
      process.exit();
    } catch (err) {
      console.error('Error importing contacts:', err);
      process.exit(1);
    }
  });
