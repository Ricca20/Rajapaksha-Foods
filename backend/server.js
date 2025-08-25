import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import connectDB from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.get('/', (req, res) => {
	res.send('Hello');
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
