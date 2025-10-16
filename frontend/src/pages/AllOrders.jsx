import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Eye, 
  Clock, 
  MapPin, 
  User, 
  DollarSign,
  Package,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../lib/api';
import OrderDetailModal from '../components/OrderDetailModal';

const AllOrders = () => {
  const navigate = useNavigate();
  const { data: allOrders = [], isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // State for filtering
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);

  // Available years (current year and previous 2 years)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }, []);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in_progress', label: 'In Progress', color: 'blue' },
    { value: 'on_the_way', label: 'On the Way', color: 'orange' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  // Filter orders based on selected criteria
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Filter by month and year
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === selectedMonth && 
             orderDate.getFullYear() === selectedYear;
    });

    // Filter by specific date if selected
    if (selectedDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const filterDate = new Date(selectedDate);
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Filter by search term (customer name, address, or order ID)
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.deliveryAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryAddress?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allOrders, selectedMonth, selectedYear, selectedDate, statusFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const statusCounts = filteredOrders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    return { totalOrders, totalRevenue, statusCounts };
  }, [filteredOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'gray';
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

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Address'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order._id,
        formatDate(order.createdAt),
        order.deliveryAddress?.name || 'N/A',
        order.menuItems?.join('; ') || 'N/A',
        order.total || 0,
        order.orderStatus,
        `"${order.deliveryAddress?.street || ''}, ${order.deliveryAddress?.city || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${monthNames[selectedMonth]}_${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="text-sm text-gray-600">
              Showing {filteredOrders.length} orders for {monthNames[selectedMonth]} {selectedYear}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.statusCounts.completed || 0}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.statusCounts.pending || 0}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Customer, address, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSelectedDate('');
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-2xl">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap rounded-2xl">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {order.deliveryAddress?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {order.deliveryAddress?.city || 'N/A'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.menuItems?.join(', ') || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.selectedPortion} • {order.selectedAddOn || 'No add-ons'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {order.total?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 border-0 font-medium bg-${getStatusColor(order.orderStatus)}-100 text-${getStatusColor(order.orderStatus)}-800 focus:ring-2 focus:ring-${getStatusColor(order.orderStatus)}-500`}
                      >
                        {statusOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium rounded-2xl">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsOrderDetailVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isVisible={isOrderDetailVisible}
        onClose={() => {
          setIsOrderDetailVisible(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onOrderUpdated={() => {
          refetch();
          // Keep modal open to show updated status
        }}
      />
    </div>
  );
};

export default AllOrders;