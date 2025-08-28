import express from 'express';
import { handleWebhook, getUserByClerkId, updateUserAddress } from '../application/application.user.js';

const UserRouter = express.Router();
UserRouter.post('/webhook', handleWebhook);
UserRouter.get('/:clerkId', getUserByClerkId);
UserRouter.put('/:clerkId/address', updateUserAddress);

export default UserRouter;

