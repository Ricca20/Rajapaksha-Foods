import express from 'express';
import { createOrder, getOrders, getTodayOrders, updateOrderStatus } from '../application/application.order.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/today', getTodayOrders);
router.patch('/:orderId/status', updateOrderStatus);


export default router;
