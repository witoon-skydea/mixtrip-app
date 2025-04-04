const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for child comments (replies)
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
  justOne: false
});

// Index for quick lookup by trip
commentSchema.index({ tripId: 1 });

// Static method to get top-level comments for a trip
commentSchema.statics.getTopLevelByTrip = function(tripId) {
  return this.find({ tripId, parentId: null })
    .sort({ createdAt: -1 })
    .populate('userId', 'username name profileImage');
};

// Static method to get all comments for a trip, including replies
commentSchema.statics.getAllByTrip = async function(tripId) {
  const comments = await this.find({ tripId })
    .sort({ createdAt: -1 })
    .populate('userId', 'username name profileImage')
    .populate({
      path: 'replies',
      populate: {
        path: 'userId',
        select: 'username name profileImage'
      }
    });
  
  // Return only top-level comments with populated replies
  return comments.filter(comment => !comment.parentId);
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
