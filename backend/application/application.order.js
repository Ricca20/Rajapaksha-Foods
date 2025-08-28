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

export const listOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};
