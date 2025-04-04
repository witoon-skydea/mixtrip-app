const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify token & user
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Token from Authorization header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Token from cookie
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Admin only middleware
exports.admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: 'Admin access required'
    });
  }
  next();
};
