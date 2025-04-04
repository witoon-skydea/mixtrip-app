const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [100, 'Trip title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Trip description is required'],
    trim: true,
    maxlength: [1000, 'Trip description cannot exceed 1000 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  duration: {
    type: Number,
    min: [1, 'Trip duration must be at least 1 day']
  },
  coverImage: {
    type: String,
    default: 'default-trip.jpg'
  },
  location: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isRemix: {
    type: Boolean,
    default: false
  },
  originalTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for trip's activities
tripSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'tripId',
  justOne: false
});

// Virtual for trip's comments
tripSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tripId',
  justOne: false
});

// Calculate trip duration
tripSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.duration = diffDays + 1; // Include first day
  }
  next();
});

// Static method to get all trips by a user
tripSchema.statics.getByUser = function(userId) {
  return this.find({ userId });
};

// Static method to search trips
tripSchema.statics.search = function(query) {
  const regex = new RegExp(query, 'i'); // case-insensitive
  return this.find({
    isPublic: true,
    $or: [
      { title: regex },
      { description: regex },
      { location: regex },
      { tags: regex }
    ]
  });
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
