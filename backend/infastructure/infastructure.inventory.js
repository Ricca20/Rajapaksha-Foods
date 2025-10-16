import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetables', 'meat', 'grains', 'spices', 'oils', 'others'],
        default: 'others'
    },
    currentStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    minStockLevel: {
        type: Number,
        required: true,
        min: 0,
        default: 10
    },
    maxStockLevel: {
        type: Number,
        required: true,
        min: 0,
        default: 100
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'liters', 'ml', 'pieces', 'packets', 'bottles', 'cans'],
        default: 'kg'
    },
    costPerUnit: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    supplier: {
        name: String,
        contact: String,
        email: String
    },
    lastRestocked: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    notes: {
        type: String,
        maxlength: 500
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
    if (this.currentStock <= 0) return 'out_of_stock';
    if (this.currentStock <= this.minStockLevel) return 'low_stock';
    if (this.currentStock >= this.maxStockLevel) return 'overstocked';
    return 'in_stock';
});

// Virtual for total value
inventorySchema.virtual('totalValue').get(function() {
    return this.currentStock * this.costPerUnit;
});

// Ensure virtual fields are serialized
inventorySchema.set('toJSON', { virtuals: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;