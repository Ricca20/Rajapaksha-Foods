import mongoose from 'mongoose';

const stockUpdateSchema = new mongoose.Schema({
    inventoryItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    type: {
        type: String,
        enum: ['ADD_STOCK', 'USE_STOCK', 'ADJUSTMENT'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    previousStock: {
        type: Number,
        required: true
    },
    newStock: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        trim: true,
        maxlength: 500
    },
    updatedBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
stockUpdateSchema.index({ inventoryItem: 1, createdAt: -1 });
stockUpdateSchema.index({ createdAt: -1 });

const StockUpdate = mongoose.model('StockUpdate', stockUpdateSchema);

export default StockUpdate;