import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());

const allowedOrigins = process.env.CLIENT_URL;
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));



app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

app.get('/', (req, res) => res.send('API is working'));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
