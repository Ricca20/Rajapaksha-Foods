import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './infastructure/db.js';
import menuRoutes from './api/api.menu.js';
import UserRouter from "./api/api.user.js";

const frontendURL = process.env.VITE_FRONTEND_URL;
const backendURL = process.env.VITE_BACKEND_URL;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
	origin: frontendURL,
	credentials: true, 
}));

app.use(express.json());
app.use("/api/menu", menuRoutes);
app.use("/api/user", UserRouter);

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
