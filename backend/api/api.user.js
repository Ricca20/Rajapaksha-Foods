import express from 'express';
import { ClerkNewUser } from '../application/application.user.js';

const UserRouter = express.Router();

UserRouter.post("/new-user", ClerkNewUser);

export default UserRouter;