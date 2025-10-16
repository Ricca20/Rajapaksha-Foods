import React, { useState } from 'react';
import { X, Star, Send, ShoppingBag } from 'lucide-react';
import { useCreateReviewMutation } from '../lib/api';
import { useUser } from '@clerk/clerk-react';

const ReviewModal = ({ isOpen, onClose, order, onReviewSubmitted }) => {
  const { user } = useUser();
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      await createReview({
        orderId: order._id,
        rating,
        comment: comment.trim(),
        userId: user.id,
        userName: user.fullName || user.firstName || 'Anonymous'
      }).unwrap();

      // Reset form
      setRating(0);
      setHoveredRating(0);
      setComment('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Leave a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <h3 className="font-medium text-gray-900">Order #{order._id?.slice(-6)}</h3>
            <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="mb-1">
              <span className="font-medium">Items:</span> {order.menuItems?.join(', ') || 'N/A'}
            </div>
            <div className="mb-1">
              <span className="font-medium">Total:</span> Rs. {order.total}.00
            </div>
            {order.selectedPortion && (
              <div className="mb-1">
                <span className="font-medium">Portion:</span> {order.selectedPortion}
              </div>
            )}
            {order.selectedAddOn && (
              <div>
                <span className="font-medium">Add-on:</span> {order.selectedAddOn}
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  ({rating} star{rating !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this order..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || rating === 0}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                isLoading || rating === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;