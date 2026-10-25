require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Career-Flux Backend is running!');
});

// Start server after database connects
const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
};

startServer();
