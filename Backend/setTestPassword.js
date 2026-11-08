
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

async function setTestPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const passwordHash = await bcrypt.hash('Test12345!', 10);

    const user = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      { $set: { passwordHash } },
      { new: true }
    );

    if (!user) {
      console.log('Test user not found.');
      return;
    }

    console.log('Test password updated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

setTestPassword();
