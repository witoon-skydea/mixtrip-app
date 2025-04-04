const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

// Home page
router.get('/', viewController.getHome);

// Auth pages
router.get('/login', viewController.getLogin);
router.get('/register', viewController.getRegister);

// Dashboard
router.get('/dashboard', viewController.getDashboard);

// Explore
router.get('/explore', viewController.getExplore);

// Error
router.get('/error', viewController.getError);

module.exports = router;
