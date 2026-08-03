require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Srishtipadam API is running' });
});

// Routes will be mounted here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/magazines', require('./routes/magazineRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes'));
app.use('/api/join', require('./routes/joinRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message || 'Server Error' });
});

module.exports = app;
