import express from 'express';
import { 
  createReview,
  getAllReviews,
  getReviewsByUser,
  canUserReviewOrder,
  deleteReview
} from '../application/application.review.js';

const router = express.Router();

// Create a new review
router.post('/', createReview);

// Get all reviews (admin)
router.get('/', getAllReviews);

// Get reviews by user
router.get('/user/:userId', getReviewsByUser);

// Check if user can review an order
router.get('/check/:orderId/:userId', canUserReviewOrder);

// Delete review (admin)
router.delete('/:reviewId', deleteReview);

export default router;