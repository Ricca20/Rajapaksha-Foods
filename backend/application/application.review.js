import Review from '../infastructure/infastructure.review.js';
import Order from '../infastructure/infastructure.order.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment, userId, userName } = req.body;

    // Validate required fields
    if (!orderId || !rating || !userId || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, rating, user ID, and user name are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own orders'
      });
    }

    // Check if order is completed
    if (order.orderStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed orders'
      });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this order'
      });
    }

    // Create new review
    const review = new Review({
      userId,
      orderId,
      rating,
      comment: comment || '',
      userName,
      orderItems: order.menuItems || [],
      orderTotal: order.total
    });

    await review.save();

    // Populate order details in response
    await review.populate('orderId', 'menuItems total createdAt');

    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Get all reviews for admin dashboard
export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, rating, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const skip = (page - 1) * limit;
    const query = {};

    // Filter by rating if provided
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };

    const reviews = await Review.find(query)
      .populate('orderId', 'menuItems total createdAt orderStatus')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(query);

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating : 0;

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        statistics: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: total,
          ratingDistribution
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get reviews by user
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
      .populate('orderId', 'menuItems total createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user reviews',
      error: error.message
    });
  }
};

// Check if user can review an order
export const canUserReviewOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.params;

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId !== userId) {
      return res.status(403).json({
        success: false,
        canReview: false,
        message: 'You can only review your own orders'
      });
    }

    // Check if order is completed
    if (order.orderStatus !== 'completed') {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: 'Order must be completed to leave a review'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: 'You have already reviewed this order',
        existingReview
      });
    }

    return res.status(200).json({
      success: true,
      canReview: true,
      message: 'You can review this order'
    });

  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking review eligibility',
      error: error.message
    });
  }
};

// Delete review (admin only)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};