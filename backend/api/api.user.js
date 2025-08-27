import express from 'express';
import { clerkNewUser } from '../application/application.user';

const UserRouter = express.Router();

UserRouter.post("/new-user", clerkNewUser);

export default UserRouter;