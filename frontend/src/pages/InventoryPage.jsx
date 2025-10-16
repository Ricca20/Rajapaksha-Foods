import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Download,
  RefreshCw,
  Bell
} from 'lucide-react';
import { 
  useGetInventoryItemsQuery, 
  useGetLowStockItemsQuery,
  useDeleteInventoryItemMutation 
} from '../lib/api';
import InventoryItemModal from '../components/InventoryItemModal';
import StockUpdateHistoryModal from '../components/StockUpdateHistoryModal';

const InventoryPage = () => {
  const navigate = useNavigate();
  const { data: inventoryData, isLoading, refetch } = useGetInventoryItemsQuery();
  const { data: lowStockData, refetch: refetchLowStock } = useGetLowStockItemsQuery();
  const [deleteItem] = useDeleteInventoryItemMutation();

  // State management
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'stock'
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockAlert, setShowLowStockAlert] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [historySelectedItem, setHistorySelectedItem] = useState(null);

  const inventoryItems = inventoryData?.data?.items || [];
  const inventorySummary = inventoryData?.data?.summary || {};
  const lowStockItems = lowStockData?.data || [];

  // Category options
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'meat', label: 'Meat & Eggs' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'spices', label: 'Spices & Seasonings' },
    { value: 'oils', label: 'Oils & Fats' },
    { value: 'others', label: 'Others' }
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'overstocked', label: 'Overstocked' }
  ];

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    let filtered = inventoryItems;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.stockStatus === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [inventoryItems, categoryFilter, statusFilter, searchTerm]);

  const handleAddItem = () => {
    setModalMode('add');
    setSelectedItem(null);
    setIsModalVisible(true);
  };

  const handleEditItem = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleUpdateStock = (item) => {
    setModalMode('stock');
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      try {
        await deleteItem(item._id).unwrap();
        alert('Item deleted successfully!');
        await handleRefresh();
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  const handleViewHistory = (item) => {
    setHistorySelectedItem(item);
    setIsHistoryModalVisible(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        refetchLowStock()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'green';
      case 'low_stock': return 'yellow';
      case 'out_of_stock': return 'red';
      case 'overstocked': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock': return <Package className="w-4 h-4" />;
      case 'low_stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out_of_stock': return <AlertTriangle className="w-4 h-4" />;
      case 'overstocked': return <TrendingUp className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Current Stock', 'Unit', 'Min Level', 'Max Level', 'Cost/Unit', 'Total Value', 'Status', 'Supplier'];
    const csvContent = [
      headers.join(','),
      ...filteredItems.map(item => [
        `"${item.name}"`,
        item.category,
        item.currentStock,
        item.unit,
        item.minStockLevel,
        item.maxStockLevel,
        item.costPerUnit,
        item.totalValue?.toFixed(2) || '0.00',
        item.stockStatus,
        `"${item.supplier?.name || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6  min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your kitchen inventory and track stock levels
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 cursor-pointer font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && showLowStockAlert && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
                <p className="text-yellow-700">
                  {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} {lowStockItems.length > 1 ? 'are' : 'is'} running low on stock
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lowStockItems.slice(0, 3).map(item => (
                    <span key={item._id} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {item.name} ({item.currentStock} {item.unit})
                    </span>
                  ))}
                  {lowStockItems.length > 3 && (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      +{lowStockItems.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLowStockAlert(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{inventorySummary.totalItems || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">Rs. {inventorySummary.totalValue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600">{inventorySummary.lowStockCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{inventorySummary.outOfStockCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by item name or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your filters or add a new inventory item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cost & Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock Updates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 capitalize mt-1">{item.category}</div>
                        {item.supplier?.name && (
                          <div className="text-xs text-gray-400 mt-0.5">Supplier: {item.supplier.name}</div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-bold text-gray-900">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          Rs. {item.costPerUnit.toFixed(2)}/{item.unit}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Total: Rs. {item.totalValue?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
                        ${item.stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' : ''}
                        ${item.stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${item.stockStatus === 'out_of_stock' ? 'bg-red-100 text-red-800' : ''}
                        ${item.stockStatus === 'overstocked' ? 'bg-purple-100 text-purple-800' : ''}
                      `}>
                        {getStatusIcon(item.stockStatus)}
                        {item.stockStatus?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Update Stock"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewHistory(item)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                        title="View Stock Update History"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Update History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inventory Item Modal */}
      <InventoryItemModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        mode={modalMode}
        onItemUpdated={() => {
          handleRefresh();
        }}
      />

      {/* Stock Update History Modal */}
      <StockUpdateHistoryModal
        isOpen={isHistoryModalVisible}
        onClose={() => {
          setIsHistoryModalVisible(false);
          setHistorySelectedItem(null);
        }}
        inventoryItem={historySelectedItem}
      />
    </div>
  );
};

export default InventoryPage;