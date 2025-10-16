import express from 'express';
import { 
  getInventoryItems, 
  getLowStockItems, 
  createInventoryItem, 
  updateInventoryItem, 
  updateStockLevel, 
  deleteInventoryItem, 
  getInventoryStats,
  getStockUpdateHistory
} from '../application/application.inventory.js';

const router = express.Router();

// Get all inventory items
router.get('/', getInventoryItems);

// Get low stock items
router.get('/low-stock', getLowStockItems);

// Get inventory statistics
router.get('/stats', getInventoryStats);

// Get stock update history for a specific item
router.get('/:id/stock-history', getStockUpdateHistory);

// Create new inventory item
router.post('/', createInventoryItem);

// Update inventory item
router.put('/:id', updateInventoryItem);

// Update stock level (add or subtract stock)
router.patch('/:id/stock', updateStockLevel);

// Delete inventory item (soft delete)
router.delete('/:id', deleteInventoryItem);

export default router;