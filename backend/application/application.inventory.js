import Inventory from '../infastructure/infastructure.inventory.js';
import stockUpdateApp from './application.stockUpdate.js';

// Get all inventory items
export const getInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.find({ isActive: true }).sort({ name: 1 });
    
    // Calculate totals and low stock count
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockCount = items.filter(item => item.stockStatus === 'low_stock').length;
    const outOfStockCount = items.filter(item => item.stockStatus === 'out_of_stock').length;
    
    return res.status(200).json({
      success: true,
      data: {
        items,
        summary: {
          totalItems,
          totalValue,
          lowStockCount,
          outOfStockCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching inventory items',
      error: error.message
    });
  }
};

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({ 
      isActive: true,
      $expr: { $lte: ['$currentStock', '$minStockLevel'] }
    }).sort({ currentStock: 1 });
    
    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching low stock items',
      error: error.message
    });
  }
};

// Create new inventory item
export const createInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      currentStock,
      minStockLevel,
      maxStockLevel,
      unit,
      costPerUnit,
      supplier,
      expiryDate,
      notes
    } = req.body;

    // Validate required fields
    if (!name || !category || currentStock === undefined || !unit || costPerUnit === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, category, currentStock, unit, costPerUnit'
      });
    }

    // Check if item already exists
    const existingItem = await Inventory.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isActive: true 
    });
    
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'An item with this name already exists'
      });
    }

    const newItem = new Inventory({
      name: name.trim(),
      category,
      currentStock,
      minStockLevel: minStockLevel || 10,
      maxStockLevel: maxStockLevel || 100,
      unit,
      costPerUnit,
      supplier,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      notes,
      lastRestocked: new Date()
    });

    const savedItem = await newItem.save();
    
    return res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: savedItem
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating inventory item',
      error: error.message
    });
  }
};

// Update inventory item
export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating inventory item',
      error: error.message
    });
  }
};

// Update stock level (for restocking or usage)
export const updateStockLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation, notes } = req.body; // operation: 'add' or 'subtract'

    if (!quantity || !operation) {
      return res.status(400).json({
        success: false,
        message: 'Quantity and operation (add/subtract) are required'
      });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const previousStock = item.currentStock;
    let newStock;
    let updateType;
    
    if (operation === 'add') {
      newStock = item.currentStock + quantity;
      item.lastRestocked = new Date();
      updateType = 'ADD_STOCK';
    } else if (operation === 'subtract') {
      newStock = Math.max(0, item.currentStock - quantity);
      updateType = 'USE_STOCK';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Operation must be either "add" or "subtract"'
      });
    }

    item.currentStock = newStock;
    if (notes) {
      item.notes = notes;
    }

    const updatedItem = await item.save();

    // Record the stock update
    try {
      await stockUpdateApp.recordStockChange(
        id,
        updateType,
        quantity,
        previousStock,
        newStock,
        notes || `Stock ${operation === 'add' ? 'added' : 'used'}`,
        req.auth?.userId || 'system'
      );
    } catch (stockUpdateError) {
      console.error('Error recording stock update:', stockUpdateError);
      // Don't fail the main operation if stock update recording fails
    }

    return res.status(200).json({
      success: true,
      message: `Stock ${operation === 'add' ? 'added' : 'reduced'} successfully`,
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating stock level:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating stock level',
      error: error.message
    });
  }
};

// Delete inventory item (soft delete)
export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Inventory.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting inventory item',
      error: error.message
    });
  }
};

// Get inventory statistics
export const getInventoryStats = async (req, res) => {
  try {
    const items = await Inventory.find({ isActive: true });
    
    const stats = {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockItems: items.filter(item => item.stockStatus === 'low_stock').length,
      outOfStockItems: items.filter(item => item.stockStatus === 'out_of_stock').length,
      categoryBreakdown: {},
      recentlyUpdated: items
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
    };

    // Calculate category breakdown
    items.forEach(item => {
      if (!stats.categoryBreakdown[item.category]) {
        stats.categoryBreakdown[item.category] = {
          count: 0,
          totalValue: 0
        };
      }
      stats.categoryBreakdown[item.category].count++;
      stats.categoryBreakdown[item.category].totalValue += item.totalValue;
    });

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching inventory statistics',
      error: error.message
    });
  }
};

// Get stock update history for a specific inventory item
export const getStockUpdateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if inventory item exists
    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const result = await stockUpdateApp.getStockUpdateHistory(id, Number(page), Number(limit));

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching stock update history:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching stock update history',
      error: error.message
    });
  }
};