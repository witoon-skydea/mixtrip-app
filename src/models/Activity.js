const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  day: {
    type: Number,
    required: [true, 'Day number is required'],
    min: [1, 'Day must be at least 1']
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Activity title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Activity description cannot exceed 500 characters']
  },
  startTime: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  location: {
    name: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number
      },
      lng: {
        type: Number
      }
    },
    placeId: {
      type: String
    }
  },
  cost: {
    amount: {
      type: Number,
      min: [0, 'Cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  photos: [{
    type: String
  }],
  category: {
    type: String,
    enum: [
      'accommodation',
      'transportation',
      'food',
      'sightseeing',
      'entertainment',
      'shopping',
      'other'
    ],
    default: 'other'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for quick lookup by trip and day
activitySchema.index({ tripId: 1, day: 1 });

// Static method to get all activities for a trip
activitySchema.statics.getByTrip = function(tripId) {
  return this.find({ tripId }).sort({ day: 1, startTime: 1 });
};

// Static method to get activities for a specific day of a trip
activitySchema.statics.getByTripAndDay = function(tripId, day) {
  return this.find({ tripId, day }).sort({ startTime: 1 });
};

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
