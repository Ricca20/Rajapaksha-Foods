import express from 'express';
import { createMenu, getMenu } from '../application/application.menu.js';

const router = express.Router();

router.post("/", createMenu);
router.get("/", getMenu);

export default router;
