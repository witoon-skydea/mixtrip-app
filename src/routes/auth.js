const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .trim()
      .escape(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .optional()
      .trim()
      .escape()
  ],
  authController.register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
  ],
  authController.login
);

// @route   GET /api/auth/me
router.get('/me', protect, authController.getMe);

// @route   PUT /api/auth/me
router.put(
  '/me',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .escape(),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('location')
      .optional()
      .trim(),
    body('website')
      .optional()
      .trim()
      .isURL()
      .withMessage('Please enter a valid URL')
  ],
  authController.updateProfile
);

// @route   PUT /api/auth/change-password
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  authController.changePassword
);

module.exports = router;
