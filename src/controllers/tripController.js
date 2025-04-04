const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      isPublic,
      tags
    } = req.body;

    // Create trip
    const trip = await Trip.create({
      title,
      description,
      userId: req.user._id,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      isPublic: isPublic !== undefined ? isPublic : true,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    next(error);
  }
};

// @desc    Get all trips (with filtering)
// @route   GET /api/trips
// @access  Public
exports.getTrips = async (req, res, next) => {
  try {
    const { search, user, tag, public } = req.query;
    
    // Build filter object
    const filter = {};
    
    // If search term is provided
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { location: regex }
      ];
    }
    
    // If user filter is provided
    if (user) {
      filter.userId = user;
    }
    
    // If tag filter is provided
    if (tag) {
      filter.tags = tag;
    }
    
    // Privacy filter - only public trips unless user is logged in and viewing their own trips
    if (public === 'true' || !req.user) {
      filter.isPublic = true;
    } else if (req.user) {
      // If logged in, allow user to see their own private trips
      filter.$or = [
        { isPublic: true },
        { userId: req.user._id }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username name profileImage');
    
    // Get total count for pagination
    const total = await Trip.countDocuments(filter);

    res.json({
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get trips error:', error);
    next(error);
  }
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Public/Private (depends on trip privacy)
exports.getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'username name profileImage')
      .populate('activities')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'username name profileImage'
        }
      });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if trip is private and user is not the owner
    if (!trip.isPublic && (!req.user || trip.userId._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'This trip is private' });
    }

    // Increment view count (only if not the owner viewing)
    if (!req.user || trip.userId._id.toString() !== req.user._id.toString()) {
      trip.views += 1;
      await trip.save();
    }

    res.json(trip);
  } catch (error) {
    console.error('Get trip by ID error:', error);
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      isPublic,
      tags
    } = req.body;

    // Find trip by ID
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the trip owner
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this trip' });
    }

    // Update trip
    const updatedFields = {
      title: title || trip.title,
      description: description || trip.description,
      startDate: startDate ? new Date(startDate) : trip.startDate,
      endDate: endDate ? new Date(endDate) : trip.endDate,
      location: location !== undefined ? location : trip.location,
      isPublic: isPublic !== undefined ? isPublic : trip.isPublic,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : trip.tags
    };

    // Update if cover image was uploaded (to be implemented with multer)
    if (req.file) {
      updatedFields.coverImage = req.file.filename;
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
      runValidators: true
    });

    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the trip owner
    if (trip.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    // Delete associated activities
    await Activity.deleteMany({ tripId: trip._id });

    // Delete trip
    await trip.deleteOne();

    res.json({ message: 'Trip removed successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    next(error);
  }
};

// @desc    Search trips
// @route   GET /api/trips/search
// @access  Public
exports.searchTrips = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const trips = await Trip.search(query)
      .populate('userId', 'username name profileImage')
      .limit(20);

    res.json(trips);
  } catch (error) {
    console.error('Search trips error:', error);
    next(error);
  }
};

// @desc    Get user trips
// @route   GET /api/trips/user/:userId
// @access  Public
exports.getUserTrips = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Build filter
    const filter = { userId };
    
    // Only show public trips if not the owner
    if (!req.user || req.user._id.toString() !== userId) {
      filter.isPublic = true;
    }

    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'username name profileImage');

    res.json(trips);
  } catch (error) {
    console.error('Get user trips error:', error);
    next(error);
  }
};
