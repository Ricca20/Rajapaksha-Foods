import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true, // One review per order
        index: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    orderItems: [{
        type: String
    }],
    orderTotal: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient queries
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

// Update updatedAt field on save
reviewSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;