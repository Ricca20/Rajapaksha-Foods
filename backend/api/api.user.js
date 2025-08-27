import express from 'express';
import { handleWebhook } from '../application/application.user.js';

const UserRouter = express.Router();

UserRouter.post("/webhook", handleWebhook);

export default UserRouter;