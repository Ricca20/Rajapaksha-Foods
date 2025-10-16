import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Package, 
  DollarSign, 
  Edit3,
  Check,
  AlertTriangle,
  Truck,
  CheckCircle
} from 'lucide-react';
import { useUpdateOrderStatusMutation } from '../lib/api';

const OrderDetailModal = ({ isVisible, onClose, order, onOrderUpdated }) => {
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Status options with icons and descriptions
  const statusOptions = [
    { 
      value: 'pending', 
      label: 'Pending', 
      color: 'yellow', 
      icon: Clock,
      description: 'Order received and awaiting preparation'
    },
    { 
      value: 'in_progress', 
      label: 'In Progress', 
      color: 'blue', 
      icon: Package,
      description: 'Order is being prepared'
    },
    { 
      value: 'on_the_way', 
      label: 'On the Way', 
      color: 'orange', 
      icon: Truck,
      description: 'Order is out for delivery'
    },
    { 
      value: 'completed', 
      label: 'Completed', 
      color: 'green', 
      icon: CheckCircle,
      description: 'Order successfully delivered'
    },
    { 
      value: 'cancelled', 
      label: 'Cancelled', 
      color: 'red', 
      icon: AlertTriangle,
      description: 'Order has been cancelled'
    }
  ];

  const getCurrentStatus = () => {
    return statusOptions.find(status => status.value === order?.orderStatus) || statusOptions[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.orderStatus) {
      setIsEditingStatus(false);
      return;
    }

    try {
      await updateOrderStatus({ orderId: order._id, status: newStatus }).unwrap();
      onOrderUpdated?.();
      setIsEditingStatus(false);
      // Show success message
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const calculateDeliveryTime = () => {
    if (!order?.createdAt) return 'N/A';
    
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const diffMs = now - orderTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;

    if (diffHours > 0) {
      return `${diffHours}h ${remainingMins}m ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  if (!isVisible || !order) return null;

  const currentStatus = getCurrentStatus();
  const StatusIcon = currentStatus.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${currentStatus.color}-100 rounded-full flex items-center justify-center`}>
                <StatusIcon className={`w-5 h-5 text-${currentStatus.color}-600`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order #{order._id.slice(-8)}
                </h2>
                <p className="text-sm text-gray-600">
                  Placed {calculateDeliveryTime()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              {!isEditingStatus && (
                <button
                  onClick={() => {
                    setIsEditingStatus(true);
                    setNewStatus(order.orderStatus);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditingStatus ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {statusOptions.map((status) => (
                    <label
                      key={status.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        newStatus === status.value
                          ? `border-${status.color}-500 bg-${status.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="orderStatus"
                        value={status.value}
                        checked={newStatus === status.value}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="sr-only"
                      />
                      <status.icon className={`w-5 h-5 mr-3 text-${status.color}-600`} />
                      <div>
                        <div className="font-medium text-gray-900">{status.label}</div>
                        <div className="text-sm text-gray-600">{status.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setIsEditingStatus(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Update Status
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-${currentStatus.color}-100 rounded-full flex items-center justify-center`}>
                  <StatusIcon className={`w-6 h-6 text-${currentStatus.color}-600`} />
                </div>
                <div>
                  <div className={`text-lg font-semibold text-${currentStatus.color}-800`}>
                    {currentStatus.label}
                  </div>
                  <div className="text-gray-600">{currentStatus.description}</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900">{order.deliveryAddress?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {order.deliveryAddress?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">User ID</label>
                  <p className="text-gray-900 font-mono text-sm">{order.userId}</p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Delivery Address
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Street Address</label>
                  <p className="text-gray-900">{order.deliveryAddress?.street || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">City</label>
                  <p className="text-gray-900">{order.deliveryAddress?.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Postal Code</label>
                  <p className="text-gray-900">{order.deliveryAddress?.postal || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Order Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Menu Items</label>
                  <div className="mt-1">
                    {order.menuItems && order.menuItems.length > 0 ? (
                      <ul className="space-y-1">
                        {order.menuItems.map((item, index) => (
                          <li key={index} className="text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No items specified</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Portion Size</label>
                  <p className="text-gray-900 capitalize">{order.selectedPortion || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Add-ons</label>
                  <p className="text-gray-900">{order.selectedAddOn || 'No add-ons'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Quantity</label>
                  <p className="text-gray-900">{order.quantity || 1} pack(s)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Special Note</label>
                  <p className="text-gray-900">{order.specialNote || 'No special instructions'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Order Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">Rs. {order.total?.toFixed(2) || '0.00'}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatDate(order.createdAt)}</div>
                <div className="text-sm text-gray-600">Order Date</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">#{order._id.slice(-8)}</div>
                <div className="text-sm text-gray-600">Order ID</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;