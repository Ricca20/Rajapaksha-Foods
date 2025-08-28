import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTodayOrdersQuery, useUpdateOrderStatusMutation } from '../lib/api';
import { Check, DollarSign, MapPin, Phone } from 'lucide-react';

const MealTimeOrders = () => {
  const { mealType } = useParams();
  const navigate = useNavigate();
  const { data: allOrders = [], isLoading } = useGetTodayOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Filter orders based on meal time
  const filterOrdersByTime = (orders, mealType) => {
    const timeRanges = {
      breakfast: { start: 6, end: 10 },
      lunch: { start: 11, end: 15 },
      dinner: { start: 16, end: 21 }
    };

    const range = timeRanges[mealType];
    if (!range) return [];

    return orders.filter(order => {
      const orderHour = new Date(order.createdAt).getHours();
      return orderHour >= range.start && orderHour <= range.end;
    });
  };

  const orders = filterOrdersByTime(allOrders, mealType);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-500">Loading orders...</div>
      </div>
    );
  }

  const capitalizedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{capitalizedMealType} Orders</h1>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{order.deliveryAddress.name}</h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <p className="text-sm">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  </p>
                </div>
                <div className="flex items-center text-gray-500 mt-1">
                  <Phone className="w-4 h-4 mr-1" />
                  <p className="text-sm">{order.deliveryAddress.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {order.orderStatus === 'on_the_way' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'completed')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'paid')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Paid
                    </button>
                  </>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'paid' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {order.orderStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">ORDER DETAILS</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Portion:</span>
                  <span className="text-sm">{order.selectedPortion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Quantity:</span>
                  <span className="text-sm">{order.quantity || 1} packs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Add-on:</span>
                  <span className="text-sm">{order.selectedAddOn || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Items:</span>
                  <span className="text-sm text-right">{order.menuItems.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Price per Pack:</span>
                  <span className="text-sm">Rs. {(order.total / (order.quantity || 1)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-sm font-semibold">Rs. {order.total}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No orders found for this meal time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealTimeOrders;
