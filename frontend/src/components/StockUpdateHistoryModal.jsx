import React, { useState, useMemo } from 'react';
import { X, Clock, Plus, Minus, Calendar, User, FileText, TrendingUp, BarChart3, Package } from 'lucide-react';
import { useGetStockUpdateHistoryQuery } from '../lib/api';

const StockUpdateHistoryModal = ({ isOpen, onClose, inventoryItem }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'stats'
  const itemsPerPage = 10;

  const { 
    data: historyData, 
    isLoading, 
    error,
    refetch
  } = useGetStockUpdateHistoryQuery(
    { 
      itemId: inventoryItem?._id, 
      page: currentPage, 
      limit: itemsPerPage 
    },
    { 
      skip: !inventoryItem?._id || !isOpen,
      refetchOnMountOrArgChange: true
    }
  );

  const handleClose = () => {
    setCurrentPage(1);
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUpdateTypeIcon = (type) => {
    switch (type) {
      case 'ADD_STOCK':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'USE_STOCK':
        return <Minus className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case 'ADD_STOCK':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'USE_STOCK':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getUpdateTypeText = (type) => {
    switch (type) {
      case 'ADD_STOCK':
        return 'Stock Added';
      case 'USE_STOCK':
        return 'Stock Used';
      default:
        return type;
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const updates = historyData?.data?.updates || historyData?.updates || [];
    if (!updates.length) return null;
    
    const totalAdded = updates
      .filter(u => u.type === 'ADD_STOCK')
      .reduce((sum, u) => sum + u.quantity, 0);
    
    const totalUsed = updates
      .filter(u => u.type === 'USE_STOCK')
      .reduce((sum, u) => sum + u.quantity, 0);
    
    const addCount = updates.filter(u => u.type === 'ADD_STOCK').length;
    const useCount = updates.filter(u => u.type === 'USE_STOCK').length;
    
    return {
      totalAdded,
      totalUsed,
      netChange: totalAdded - totalUsed,
      addCount,
      useCount,
      totalUpdates: updates.length
    };
  }, [historyData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Stock Update History</h2>
            {inventoryItem && (
              <p className="text-sm text-gray-600 mt-1">
                {inventoryItem.name} • Current Stock: <span className="font-bold text-orange-600 text-base">{inventoryItem.currentStock} {inventoryItem.unit}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-160px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading stock update history</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !historyData?.data?.updates?.length && !historyData?.updates?.length ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No stock updates found</p>
              <p className="text-gray-500 mb-4">Stock update history will appear here when changes are made.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-left">
                <p className="text-sm font-medium text-blue-900 mb-2">💡 How to create stock updates:</p>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Click the "Update Stock" button (↻) on any inventory item</li>
                  <li>Choose "Add Stock" or "Subtract Stock"</li>
                  <li>Enter quantity and notes</li>
                  <li>Save - and the update will appear here!</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'timeline' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-2" />
                    Timeline
                  </button>
                  <button
                    onClick={() => setViewMode('stats')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'stats' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Statistics
                  </button>
                </div>

                {/* Summary Stats */}
                {(historyData?.data?.pagination || historyData?.pagination) && (
                  <div className="text-sm text-gray-600">
                    Total Updates: <span className="font-semibold">{(historyData?.data?.pagination || historyData?.pagination)?.totalUpdates}</span>
                  </div>
                )}
              </div>

              {/* Statistics View */}
              {viewMode === 'stats' && statistics && (
                <div className="space-y-6">
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-green-600 font-medium mb-1">Total Added</p>
                          <p className="text-2xl font-bold text-green-700">
                            +{statistics.totalAdded}
                          </p>
                          <p className="text-xs text-green-600 mt-1">{statistics.addCount} operations</p>
                        </div>
                        <Plus className="w-8 h-8 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-red-600 font-medium mb-1">Total Used</p>
                          <p className="text-2xl font-bold text-red-700">
                            -{statistics.totalUsed}
                          </p>
                          <p className="text-xs text-red-600 mt-1">{statistics.useCount} operations</p>
                        </div>
                        <Minus className="w-8 h-8 text-red-500" />
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-purple-600 font-medium mb-1">Net Change</p>
                          <p className={`text-2xl font-bold ${statistics.netChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {statistics.netChange >= 0 ? '+' : ''}{statistics.netChange}
                          </p>
                          <p className="text-xs text-purple-600 mt-1">{inventoryItem?.unit}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>
                  </div>

                  {/* Summary Info */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Total Updates</p>
                          <p className="text-xl font-bold text-gray-900">{statistics.totalUpdates}</p>
                        </div>
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Current Stock</p>
                          <p className="text-xl font-bold text-orange-600">{inventoryItem?.currentStock} {inventoryItem?.unit}</p>
                        </div>
                        <Package className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline View */}
              {viewMode === 'timeline' && (
                <div>
                  {/* Summary Info */}
                  {(historyData?.data?.pagination || historyData?.pagination) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, (historyData?.data?.pagination || historyData?.pagination)?.totalUpdates)} of {(historyData?.data?.pagination || historyData?.pagination)?.totalUpdates}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {(historyData?.data?.updates || historyData?.updates || []).map((update, index) => (
                  <div key={update._id} className="relative flex items-start space-x-4 pb-6">
                    {/* Timeline node */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${getUpdateTypeColor(update.type)} flex items-center justify-center bg-white relative z-10`}>
                      {getUpdateTypeIcon(update.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUpdateTypeColor(update.type)}`}>
                              {getUpdateTypeText(update.type)}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {update.type === 'ADD_STOCK' ? '+' : '-'}{update.quantity} {inventoryItem?.unit}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(update.createdAt)}
                          </div>
                        </div>

                        {/* Stock Change Details */}
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Previous Stock:</span>
                            <p className="font-medium">{update.previousStock} {inventoryItem?.unit}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Change:</span>
                            <p className={`font-medium ${update.type === 'ADD_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
                              {update.type === 'ADD_STOCK' ? '+' : '-'}{update.quantity} {inventoryItem?.unit}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">New Stock:</span>
                            <p className="font-medium">{update.newStock} {inventoryItem?.unit}</p>
                          </div>
                        </div>

                        {/* Note */}
                        {update.note && (
                          <div className="bg-gray-50 rounded-md p-3 mb-3">
                            <div className="flex items-start space-x-2">
                              <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{update.note}</p>
                            </div>
                          </div>
                        )}

                        {/* Updated By */}
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          Updated by: {update.updatedBy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {(historyData?.data?.pagination || historyData?.pagination) && (historyData?.data?.pagination || historyData?.pagination)?.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {(historyData?.data?.pagination || historyData?.pagination)?.currentPage} of {(historyData?.data?.pagination || historyData?.pagination)?.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!(historyData?.data?.pagination || historyData?.pagination)?.hasPrev}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!(historyData?.data?.pagination || historyData?.pagination)?.hasNext}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockUpdateHistoryModal;