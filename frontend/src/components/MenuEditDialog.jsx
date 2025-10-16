import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Save, DollarSign } from 'lucide-react';
import { useUpdateMenuMutation } from '../lib/api';

const MenuEditDialog = ({ isVisible, onClose, menu, onMenuUpdated }) => {
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();
  const [formData, setFormData] = useState({
    menuItems: [],
    priceFull: 0,
    priceHalf: 0,
    addOns: {
      isChicken: false,
      isEgg: false,
      isFish: false,
      isSausage: false
    }
  });
  const [newMenuItem, setNewMenuItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingText, setEditingText] = useState('');

  // Initialize form data when menu changes
  useEffect(() => {
    if (menu?.data) {
      setFormData({
        menuItems: [...(menu.data.menuItems || [])],
        priceFull: menu.data.priceFull || 0,
        priceHalf: menu.data.priceHalf || 0,
        addOns: {
          isChicken: menu.data.addOns?.isChicken || false,
          isEgg: menu.data.addOns?.isEgg || false,
          isFish: menu.data.addOns?.isFish || false,
          isSausage: menu.data.addOns?.isSausage || false
        }
      });
    }
  }, [menu]);

  const handleAddMenuItem = () => {
    if (newMenuItem.trim()) {
      setFormData(prev => ({
        ...prev,
        menuItems: [...prev.menuItems, newMenuItem.trim()]
      }));
      setNewMenuItem('');
    }
  };

  const handleRemoveMenuItem = (index) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index)
    }));
  };

  const handleEditMenuItem = (index) => {
    setEditingIndex(index);
    setEditingText(formData.menuItems[index]);
  };

  const handleSaveEditMenuItem = () => {
    if (editingText.trim()) {
      setFormData(prev => ({
        ...prev,
        menuItems: prev.menuItems.map((item, i) => 
          i === editingIndex ? editingText.trim() : item
        )
      }));
    }
    setEditingIndex(-1);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingText('');
  };

  const handlePriceChange = (priceType, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [priceType]: numValue
    }));
  };

  const handleAddOnChange = (addOnType, checked) => {
    setFormData(prev => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [addOnType]: checked
      }
    }));
  };

  const handleSaveMenu = async () => {
    try {
      // Validate form data
      if (formData.menuItems.length === 0) {
        alert('Please add at least one menu item before saving.');
        return;
      }
      if (formData.priceFull <= 0 || formData.priceHalf <= 0) {
        alert('Please set valid prices for both full and half portions.');
        return;
      }

      const result = await updateMenu(formData).unwrap();
      
      // Show success message
      alert('Menu updated successfully! You can now manage the order window.');
      
      onMenuUpdated?.(result);
      onClose();
    } catch (error) {
      console.error('Failed to update menu:', error);
      alert('Failed to update menu. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Update menu items, prices, and add-on availability before opening the order window.
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Menu Items Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Menu Items
            </h3>
            
            {/* Add New Item */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMenuItem}
                onChange={(e) => setNewMenuItem(e.target.value)}
                placeholder="Enter new menu item..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddMenuItem()}
              />
              <button
                onClick={handleAddMenuItem}
                disabled={!newMenuItem.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Menu Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {formData.menuItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEditMenuItem()}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEditMenuItem}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900">{item}</span>
                      <button
                        onClick={() => handleEditMenuItem(index)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveMenuItem(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              {formData.menuItems.length === 0 && (
                <p className="text-center text-gray-500 py-4">No menu items added yet.</p>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Portion Price (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceFull}
                  onChange={(e) => handlePriceChange('priceFull', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Half Portion Price (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceHalf}
                  onChange={(e) => handlePriceChange('priceHalf', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Add-ons Availability</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'isChicken', label: 'Chicken' },
                { key: 'isEgg', label: 'Egg' },
                { key: 'isFish', label: 'Fish' },
                { key: 'isSausage', label: 'Sausage' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.addOns[key]}
                    onChange={(e) => handleAddOnChange(key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMenu}
              disabled={isUpdating}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEditDialog;