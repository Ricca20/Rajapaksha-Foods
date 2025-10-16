import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Minus } from 'lucide-react';
import { useCreateInventoryItemMutation, useUpdateInventoryItemMutation, useUpdateStockLevelMutation } from '../lib/api';

const InventoryItemModal = ({ isVisible, onClose, item, mode, onItemUpdated }) => {
  // mode: 'add', 'edit', 'stock' (for stock updates)
  const [createItem, { isLoading: isCreating }] = useCreateInventoryItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateInventoryItemMutation();
  const [updateStock, { isLoading: isUpdatingStock }] = useUpdateStockLevelMutation();

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    category: 'others',
    currentStock: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    unit: 'kg',
    costPerUnit: 0,
    supplier: {
      name: '',
      contact: '',
      email: ''
    },
    expiryDate: '',
    notes: ''
  });

  // Stock update state
  const [stockData, setStockData] = useState({
    quantity: 0,
    operation: 'add',
    notes: ''
  });

  // Category options
  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'meat', label: 'Meat & Eggs' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'spices', label: 'Spices & Seasonings' },
    { value: 'oils', label: 'Oils & Fats' },
    { value: 'others', label: 'Others' }
  ];

  // Unit options
  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'liters', label: 'Liters (L)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'packets', label: 'Packets' },
    { value: 'bottles', label: 'Bottles' },
    { value: 'cans', label: 'Cans' }
  ];

  // Initialize form data when item changes
  useEffect(() => {
    if (item && (mode === 'edit' || mode === 'stock')) {
      setFormData({
        name: item.name || '',
        category: item.category || 'others',
        currentStock: item.currentStock || 0,
        minStockLevel: item.minStockLevel || 10,
        maxStockLevel: item.maxStockLevel || 100,
        unit: item.unit || 'kg',
        costPerUnit: item.costPerUnit || 0,
        supplier: {
          name: item.supplier?.name || '',
          contact: item.supplier?.contact || '',
          email: item.supplier?.email || ''
        },
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
        notes: item.notes || ''
      });
    } else if (mode === 'add') {
      // Reset form for new item
      setFormData({
        name: '',
        category: 'others',
        currentStock: 0,
        minStockLevel: 10,
        maxStockLevel: 100,
        unit: 'kg',
        costPerUnit: 0,
        supplier: {
          name: '',
          contact: '',
          email: ''
        },
        expiryDate: '',
        notes: ''
      });
    }

    // Reset stock data
    setStockData({
      quantity: 0,
      operation: 'add',
      notes: ''
    });
  }, [item, mode]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'stock') {
      // Handle stock update
      if (stockData.quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
      }

      try {
        await updateStock({
          id: item._id,
          quantity: stockData.quantity,
          operation: stockData.operation,
          notes: stockData.notes
        }).unwrap();

        alert(`Stock ${stockData.operation === 'add' ? 'added' : 'reduced'} successfully!`);
        onItemUpdated?.();
        onClose();
      } catch (error) {
        console.error('Failed to update stock:', error);
        alert('Failed to update stock. Please try again.');
      }
      return;
    }

    // Validate form data
    if (!formData.name.trim()) {
      alert('Item name is required');
      return;
    }

    if (formData.costPerUnit < 0) {
      alert('Cost per unit cannot be negative');
      return;
    }

    if (formData.minStockLevel > formData.maxStockLevel) {
      alert('Minimum stock level cannot be greater than maximum stock level');
      return;
    }

    try {
      if (mode === 'add') {
        await createItem(formData).unwrap();
        alert('Inventory item created successfully!');
      } else if (mode === 'edit') {
        await updateItem({
          id: item._id,
          ...formData
        }).unwrap();
        alert('Inventory item updated successfully!');
      }

      onItemUpdated?.();
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  if (!isVisible) return null;

  const getModalTitle = () => {
    switch (mode) {
      case 'add': return 'Add New Inventory Item';
      case 'edit': return 'Edit Inventory Item';
      case 'stock': return 'Update Stock Level';
      default: return 'Inventory Item';
    }
  };

  const isLoading = isCreating || isUpdating || isUpdatingStock;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{getModalTitle()}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {mode === 'stock' ? (
            // Stock Update Form
            <div className="space-y-6">
              {/* Current Stock Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Stock Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Item:</span>
                    <p className="text-gray-900">{item?.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Current Stock:</span>
                    <p className="text-gray-900">{item?.currentStock} {item?.unit}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      item?.stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                      item?.stockStatus === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                      item?.stockStatus === 'overstocked' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item?.stockStatus?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Update Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      stockData.operation === 'add'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="operation"
                        value="add"
                        checked={stockData.operation === 'add'}
                        onChange={(e) => setStockData(prev => ({ ...prev, operation: e.target.value }))}
                        className="sr-only"
                      />
                      <Plus className="w-5 h-5 mr-2" />
                      Add Stock
                    </label>
                    <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      stockData.operation === 'subtract'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="operation"
                        value="subtract"
                        checked={stockData.operation === 'subtract'}
                        onChange={(e) => setStockData(prev => ({ ...prev, operation: e.target.value }))}
                        className="sr-only"
                      />
                      <Minus className="w-5 h-5 mr-2" />
                      Use Stock
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity ({item?.unit})
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={stockData.quantity}
                    onChange={(e) => setStockData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={stockData.notes}
                  onChange={(e) => setStockData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this stock update..."
                />
              </div>
            </div>
          ) : (
            // Add/Edit Item Form
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Basmati Rice"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.currentStock}
                    onChange={(e) => handleInputChange('currentStock', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock Level *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minStockLevel}
                    onChange={(e) => handleInputChange('minStockLevel', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Stock Level *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxStockLevel}
                    onChange={(e) => handleInputChange('maxStockLevel', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Unit and Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit (Rs.) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) => handleInputChange('costPerUnit', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Supplier Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Supplier Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name</label>
                    <input
                      type="text"
                      value={formData.supplier.name}
                      onChange={(e) => handleInputChange('supplier.name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      value={formData.supplier.contact}
                      onChange={(e) => handleInputChange('supplier.contact', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+94 77 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.supplier.email}
                      onChange={(e) => handleInputChange('supplier.email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="supplier@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'stock' ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === 'stock' ? 'Update Stock' : 'Save Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryItemModal;