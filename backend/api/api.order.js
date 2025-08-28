import express from 'express';
import { createOrder, getOrders, getTodayOrders, updateOrderStatus, listOrdersByUser } from '../application/application.order.js';
import { cancelOrder } from '../application/application.order.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/today', getTodayOrders);
router.patch('/:orderId/status', updateOrderStatus);

router.get('/user/:userId', listOrdersByUser);
router.post('/:orderId/cancel', cancelOrder);

export default router;
