import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './infastructure/db.js';

import menuRoutes from './api/api.menu.js';

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

connectDB();
app.get('/', (req, res) => {
	res.send('Hello');
});

app.listen(PORT, () => {
	console.log(`Server running on ${backendURL}`);
});
