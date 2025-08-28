import Order from '../infastructure/infastructure.order.js';

export const createOrder = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
};
