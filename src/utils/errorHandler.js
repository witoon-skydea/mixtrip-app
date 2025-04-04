// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Check if request expects JSON or HTML
  const isApi = req.originalUrl.startsWith('/api');

  // Development error response - send detailed error
  if (process.env.NODE_ENV === 'development') {
    if (isApi) {
      return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
    } else {
      return res.status(err.statusCode).render('error', {
        title: 'Error',
        message: err.message,
        error: err,
        stack: err.stack
      });
    }
  }

  // Production error response - don't leak error details
  // Handle specific error types
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again!';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again!';
    error = new AppError(message, 401);
  }

  // Send appropriate response format
  if (isApi) {
    // For API requests, send JSON
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    } else {
      // For programming or unknown errors, send generic message
      console.error('ERROR 💥', err);
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  } else {
    // For HTML requests, render error page
    return res.status(error.statusCode || 500).render('error', {
      title: 'Error',
      message: error.isOperational ? error.message : 'Something went wrong. Please try again later.'
    });
  }
};

module.exports = {
  AppError,
  errorHandler
};
