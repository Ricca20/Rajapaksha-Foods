import StockUpdate from '../infastructure/infastructure.stockUpdate.js';
import Inventory from '../infastructure/infastructure.inventory.js';

class StockUpdateApplication {
    // Create a new stock update record
    async createStockUpdate(data) {
        try {
            const stockUpdate = new StockUpdate(data);
            await stockUpdate.save();
            return stockUpdate;
        } catch (error) {
            throw new Error(`Error creating stock update: ${error.message}`);
        }
    }

    // Get stock update history for a specific inventory item
    async getStockUpdateHistory(inventoryItemId, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            
            const updates = await StockUpdate.find({ inventoryItem: inventoryItemId })
                .populate('inventoryItem', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const total = await StockUpdate.countDocuments({ inventoryItem: inventoryItemId });
            
            return {
                updates,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalUpdates: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Error fetching stock update history: ${error.message}`);
        }
    }

    // Get all stock updates (for admin overview)
    async getAllStockUpdates(page = 1, limit = 50, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const query = {};

            // Apply filters
            if (filters.type) {
                query.type = filters.type;
            }
            
            if (filters.dateFrom && filters.dateTo) {
                query.createdAt = {
                    $gte: new Date(filters.dateFrom),
                    $lte: new Date(filters.dateTo)
                };
            }

            if (filters.inventoryItem) {
                query.inventoryItem = filters.inventoryItem;
            }

            const updates = await StockUpdate.find(query)
                .populate('inventoryItem', 'name category')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const total = await StockUpdate.countDocuments(query);
            
            return {
                updates,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalUpdates: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Error fetching all stock updates: ${error.message}`);
        }
    }

    // Get recent stock updates for dashboard
    async getRecentStockUpdates(limit = 10) {
        try {
            const updates = await StockUpdate.find()
                .populate('inventoryItem', 'name category')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            
            return updates;
        } catch (error) {
            throw new Error(`Error fetching recent stock updates: ${error.message}`);
        }
    }

    // Helper method to create stock update when inventory is modified
    async recordStockChange(inventoryItemId, type, quantity, previousStock, newStock, note, updatedBy) {
        try {
            const updateData = {
                inventoryItem: inventoryItemId,
                type,
                quantity: Math.abs(quantity),
                previousStock,
                newStock,
                note: note || '',
                updatedBy
            };

            return await this.createStockUpdate(updateData);
        } catch (error) {
            throw new Error(`Error recording stock change: ${error.message}`);
        }
    }
}

export default new StockUpdateApplication();