import express from 'express';
import { createOrder, listOrdersByUser } from '../application/application.order.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', listOrdersByUser);

export default router;
