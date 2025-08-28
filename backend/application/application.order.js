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


export const getOrders = async (req, res) => {
  try {
    
    const orders = await Order.find();
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'An error occurred while fetching orders',
      redirect: '/'
    });
  }
}

export const getTodayOrders = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching today\'s orders:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching today\'s orders',
      redirect: '/'
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'on_the_way', 'completed', 'paid', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
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

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body || {};
    if (!orderId || !userId) {
      return res.status(400).json({ success: false, message: 'orderId and userId are required' });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.deleteOne({ _id: orderId });
    return res.status(200).json({ success: true, message: 'Order canceled' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error canceling order', error: error.message });
  }
};
