import express from 'express';
import { createOrder } from '../application/application.order.js';

const router = express.Router();

router.post('/', createOrder);

export default router;
