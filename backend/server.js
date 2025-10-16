import dotenv from "dotenv";
dotenv.config();
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import express from 'express';
import cors from 'cors';
import connectDB from './infastructure/db.js';
import menuRoutes from './api/api.menu.js';
import UserRouter from "./api/api.user.js";
import orderRoutes from './api/api.order.js';
import inventoryRoutes from './api/api.inventory.js';
import reviewRoutes from './api/api.review.js';
import employeeRoutes from './api/api.employee.js';

const frontendURL = process.env.VITE_FRONTEND_URL;
const backendURL = process.env.VITE_BACKEND_URL;

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Clerk with the secret key
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('Missing Clerk Secret Key');
}

// Initialize Clerk middleware
const clerk = ClerkExpressWithAuth();
app.use(cors({
	origin: frontendURL,
	credentials: true, 
}));

app.use(express.json());

// Apply Clerk middleware to protected routes
app.use("/api/menu", clerk, menuRoutes);
app.use("/api/user", clerk, UserRouter);
app.use("/api/orders", clerk, orderRoutes);
app.use("/api/inventory", clerk, inventoryRoutes);
app.use("/api/reviews", clerk, reviewRoutes);
app.use("/api/employees", clerk, employeeRoutes);

connectDB();
app.get('/', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting
    const state = (await import('mongoose')).default.connection.readyState;
    if (state === 1) dbStatus = 'connected';
    else if (state === 2) dbStatus = 'connecting';
    else if (state === 0) dbStatus = 'disconnected';
    else if (state === 3) dbStatus = 'disconnecting';
    console.log(`MongoDB status: ${dbStatus}`);
  } catch (err) {
    dbStatus = 'error';
    console.log('Error checking MongoDB status:', err.message);
  }
  res.send(`Hello. MongoDB status: ${dbStatus}`);
});

app.listen(PORT, () => {
	console.log(`Server running on ${backendURL}`);
});
