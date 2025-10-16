import React, { useState } from 'react';
import { Coffee, Sun, Moon, Clock, ArrowRight, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetTodayOrdersQuery, 
  useUpdateOrderStatusMutation,
  useSetOrderWindowMutation,
  useGetMenuQuery
} from '../lib/api';
import MenuEditDialog from '../components/MenuEditDialog';

const OrdersToday = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading: ordersLoading } = useGetTodayOrdersQuery();
  const { data: menu, isLoading: menuLoading } = useGetMenuQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [setOrderWindow] = useSetOrderWindowMutation();
  const [isOpenDialogVisible, setIsOpenDialogVisible] = useState(false);
  const [isMenuEditDialogVisible, setIsMenuEditDialogVisible] = useState(false);

  const isLoading = ordersLoading || menuLoading;

  // Function to categorize orders by time of day
  const getCurrentMealTime = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10) return 'breakfast';
    if (hour >= 11 && hour <= 15) return 'lunch';
    if (hour >= 16 && hour <= 21) return 'dinner';
    return 'closed';
  };

  const categorizeOrders = (orders) => {
    if (!orders) return { breakfast: [], lunch: [], dinner: [] };

    return orders.reduce((acc, order) => {
      const orderHour = new Date(order.createdAt).getHours();
      
      // Breakfast: 6 AM to 10 AM
      // Lunch: 11 AM to 3 PM
      // Dinner: 4 PM to 9 PM
      if (orderHour >= 6 && orderHour <= 10) {
        acc.breakfast.push(order);
      } else if (orderHour >= 11 && orderHour <= 15) {
        acc.lunch.push(order);
      } else if (orderHour >= 16 && orderHour <= 21) {
        acc.dinner.push(order);
      }
      return acc;
    }, { breakfast: [], lunch: [], dinner: [] });
  };

  const categorizedOrders = categorizeOrders(orders);

  // Function to count menu items by type and portion
  const countMenuItems = (orders) => {
    const counts = {
      veg: { Full: 0, Half: 0 },
      chicken: { Full: 0, Half: 0 },
      egg: { Full: 0, Half: 0 },
      fish: { Full: 0, Half: 0 },
      sausage: { Full: 0, Half: 0 }
    };

    orders.forEach(order => {
      const type = order.selectedAddOn ? order.selectedAddOn.toLowerCase() : 'veg';
      const portion = order.selectedPortion || 'Full';
      const orderQuantity = order.quantity || 1;
      if (counts[type]) {
        counts[type][portion] = (counts[type][portion] || 0) + orderQuantity;
      }
    });

    // Filter out categories with zero orders
    return Object.fromEntries(
      Object.entries(counts).filter(([_, values]) => 
        Object.values(values).some(count => count > 0)
      )
    );
  };

  const currentMealTime = getCurrentMealTime();
  
  const mealTimeCards = [
    { 
      id: 'breakfast',
      label: 'Breakfast (6 AM - 10 AM)',
      icon: Coffee,
      color: 'orange',
      orders: categorizedOrders.breakfast,
      isActive: currentMealTime === 'breakfast'
    },
    { 
      id: 'lunch',
      label: 'Lunch (11 AM - 3 PM)',
      icon: Sun,
      color: 'yellow',
      orders: categorizedOrders.lunch,
      isActive: currentMealTime === 'lunch'
    },
    { 
      id: 'dinner',
      label: 'Dinner (4 PM - 9 PM)',
      icon: Moon,
      color: 'purple',
      orders: categorizedOrders.dinner,
      isActive: currentMealTime === 'dinner'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Today's Orders Summary</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Current Time: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={() => setIsMenuEditDialogVisible(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Menu
          </button>
          <button
            onClick={() => setIsOpenDialogVisible(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Manage Order Window
          </button>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            menu?.data?.isOrderingEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {menu?.data?.isOrderingEnabled ? 'Window Open' : 'Window Closed'}
          </div>
        </div>
      </div>

      {/* Menu Edit Dialog */}
      <MenuEditDialog
        isVisible={isMenuEditDialogVisible}
        onClose={() => setIsMenuEditDialogVisible(false)}
        menu={menu}
        onMenuUpdated={() => {
          // After menu is updated, show the order window dialog
          setIsMenuEditDialogVisible(false);
          setIsOpenDialogVisible(true);
        }}
      />

      {/* Order Window Dialog */}
      {isOpenDialogVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Order Window</h2>
            <div className="space-y-6">
              {/* Current Status */}
              <div className={`p-4 rounded-lg ${menu?.data?.isOrderingEnabled ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Current Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    menu?.data?.isOrderingEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {menu?.data?.isOrderingEnabled ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{menu?.data?.orderWindowMessage}</p>
              </div>

              {/* Service Hours Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Service Hours</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Breakfast: 6:00 AM - 10:00 AM</p>
                  <p>Lunch: 11:00 AM - 3:00 PM</p>
                  <p>Dinner: 4:00 PM - 9:00 PM</p>
                </div>
              </div>

              {/* Toggle Button */}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    const isEnabled = !menu?.data?.isOrderingEnabled;
                    setOrderWindow({
                      isEnabled,
                      message: isEnabled 
                        ? `Our food service is now open! Order your favorite meals for ${getCurrentMealTime()}.`
                        : "Our ordering service is currently closed. Please check back during our service hours."
                    });
                    setIsOpenDialogVisible(false);
                  }}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    menu?.data?.isOrderingEnabled
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {menu?.data?.isOrderingEnabled ? 'Close Order Window' : 'Open Order Window'}
                </button>
                
                <button
                  onClick={() => setIsOpenDialogVisible(false)}
                  className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mealTimeCards.map(({ id, label, icon: Icon, color, orders, isActive }) => {
          const itemCounts = countMenuItems(orders);
          const totalOrders = orders.length;
          
          return (
            <div 
              key={id} 
              className={`${
                isActive 
                  ? `bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-${color}-500` 
                  : 'bg-gray-100 rounded-xl shadow-sm overflow-hidden border-t-4 border-gray-300 opacity-50'
              }`}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center mr-4`}>
                      <Icon className={`w-6 h-6 text-${color}-500`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                      <p className="text-sm text-gray-500">{totalOrders} orders</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  {Object.entries(itemCounts).map(([type, portions]) => (
                    <div key={type} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-semibold capitalize text-gray-700">
                          {type === 'veg' ? 'Vegetarian' : type}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(portions).map(([portion, count]) => (
                          count > 0 && (
                            <div key={`${type}-${portion}`} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{portion}</span>
                              <span className="text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                {count} packs
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                  {totalOrders === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">No orders yet</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Packs</span>
                    <span className="ml-2 text-base font-semibold text-gray-900">
                      {totalOrders} packs
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        // Update all orders in this time period to on_the_way
                        const ordersToUpdate = orders.filter(order => 
                          order.orderStatus === 'pending' || order.orderStatus === 'in_progress'
                        );
                        
                        // Update each order status to "on_the_way"
                        await Promise.all(
                          ordersToUpdate.map(order => 
                            updateOrderStatus({ 
                              orderId: order._id, 
                              status: 'on_the_way' 
                            }).unwrap()
                          )
                        );
                        
                        // Navigate to the detailed orders page
                        navigate(`/admin/orders/${id}`);
                      } catch (error) {
                        console.error('Error updating order statuses:', error);
                        alert('Failed to start delivery. Please try again.');
                      }
                    }}
                    disabled={!isActive || totalOrders === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isActive && totalOrders > 0
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Start Delivery
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersToday;
