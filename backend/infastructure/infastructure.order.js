import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  menuItems: [String],
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
});

export default mongoose.model('Order', OrderSchema);
