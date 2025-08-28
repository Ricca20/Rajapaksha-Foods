import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  menuItems: [String],
  quantity: { type: Number, required: true, default: 1 },
  selectedPortion: String,
  selectedAddOn: String,
  total: Number,
  deliveryAddress: {
    name: String,
    street: String,
    city: String,
    postal: String,
    phone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'on_the_way', 'completed', 'cancelled'],
    default: 'pending',
  },
});

export default mongoose.model('Order', OrderSchema);
