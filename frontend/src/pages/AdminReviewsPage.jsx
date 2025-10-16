import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Star,
  Filter,
  Search,
  Trash2,
  User,
  Calendar,
  ShoppingBag,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useGetAllReviewsQuery, useDeleteReviewMutation } from '../lib/api';

const AdminReviewsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 20;

  const { 
    data: reviewsData, 
    isLoading, 
    error,
    refetch
  } = useGetAllReviewsQuery({
    page: currentPage,
    limit: itemsPerPage,
    rating: ratingFilter,
    sortBy,
    order: sortOrder
  });

  const [deleteReview] = useDeleteReviewMutation();

  const reviews = reviewsData?.data?.reviews || [];
  const pagination = reviewsData?.data?.pagination || {};
  const statistics = reviewsData?.data?.statistics || {};

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await deleteReview(reviewId).unwrap();
        refetch();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingDistributionPercentage = (ratingCount, total) => {
    return total > 0 ? Math.round((ratingCount / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
                <p className="text-gray-600">Manage and monitor customer feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalReviews || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{statistics.averageRating || 0}</p>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.ratingDistribution?.find(r => r._id === 5)?.count || 0}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(review => {
                    const reviewDate = new Date(review.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return reviewDate >= weekAgo;
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        {statistics.ratingDistribution && statistics.ratingDistribution.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const ratingData = statistics.ratingDistribution.find(r => r._id === rating);
                const count = ratingData?.count || 0;
                const percentage = getRatingDistributionPercentage(count, statistics.totalReviews);
                
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                    <span className="text-sm text-gray-500 w-12">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
            </select>

            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading reviews</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No reviews found</p>
              <p className="text-gray-500">Reviews will appear here when customers submit them.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Review Header */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{review.userName}</span>
                        </div>
                        {renderStars(review.rating)}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>

                      {/* Order Information */}
                      <div className="bg-gray-50 rounded-md p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingBag className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Order #{review.orderId?._id?.slice(-6) || 'N/A'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Rs. {review.orderTotal}.00
                          </span>
                        </div>
                        {review.orderItems && review.orderItems.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Items:</span> {review.orderItems.join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Review Comment */}
                      {review.comment && (
                        <div className="text-gray-700">
                          <p className="italic">"{review.comment}"</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="ml-4">
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, pagination.totalReviews)} of {pagination.totalReviews} reviews
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;