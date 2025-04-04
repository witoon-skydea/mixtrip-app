const express = require('express');
const { body } = require('express-validator');
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/trips
router.get('/', tripController.getTrips);

// @route   GET /api/trips/search
router.get('/search', tripController.searchTrips);

// @route   GET /api/trips/user/:userId
router.get('/user/:userId', tripController.getUserTrips);

// @route   POST /api/trips
router.post(
  '/',
  protect,
  [
    body('title')
      .notEmpty()
      .withMessage('Trip title is required')
      .isLength({ max: 100 })
      .withMessage('Trip title cannot exceed 100 characters')
      .trim(),
    body('description')
      .notEmpty()
      .withMessage('Trip description is required')
      .isLength({ max: 1000 })
      .withMessage('Trip description cannot exceed 1000 characters')
      .trim(),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date')
      .custom((value, { req }) => {
        if (req.body.startDate && value) {
          const startDate = new Date(req.body.startDate);
          const endDate = new Date(value);
          if (endDate < startDate) {
            throw new Error('End date must be after start date');
          }
        }
        return true;
      }),
    body('location')
      .optional()
      .trim(),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean value'),
    body('tags')
      .optional()
  ],
  tripController.createTrip
);

// @route   GET /api/trips/:id
router.get('/:id', tripController.getTripById);

// @route   PUT /api/trips/:id
router.put(
  '/:id',
  protect,
  [
    body('title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Trip title cannot exceed 100 characters')
      .trim(),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Trip description cannot exceed 1000 characters')
      .trim(),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date')
      .custom((value, { req }) => {
        if (req.body.startDate && value) {
          const startDate = new Date(req.body.startDate);
          const endDate = new Date(value);
          if (endDate < startDate) {
            throw new Error('End date must be after start date');
          }
        }
        return true;
      }),
    body('location')
      .optional()
      .trim(),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean value'),
    body('tags')
      .optional()
  ],
  tripController.updateTrip
);

// @route   DELETE /api/trips/:id
router.delete('/:id', protect, tripController.deleteTrip);

module.exports = router;
