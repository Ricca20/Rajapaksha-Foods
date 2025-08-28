import express from 'express';
import { createMenu, getMenu, setOrderWindow } from '../application/application.menu.js';

const router = express.Router();

router.post("/", createMenu);
router.get("/", getMenu);
router.post("/order-window", setOrderWindow);

export default router;
