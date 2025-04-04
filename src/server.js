require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Import routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const viewRoutes = require('./routes/views');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// View routes
app.use('/', viewRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { title: 'MixTrip - Travel Route Planning' });
});

// Import error handler
const { errorHandler } = require('./utils/errorHandler');

// API route for checking API status
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'API is running', 
    environment: process.env.NODE_ENV,
    timestamp: new Date() 
  });
});

// 404 handler
app.use((req, res, next) => {
  // Check if API route
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'API endpoint not found' 
    });
  }
  
  // For web routes, render error page
  res.status(404).render('error', { 
    title: 'Page Not Found', 
    message: 'The page you are looking for does not exist.' 
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
