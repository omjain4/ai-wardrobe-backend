import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import wardrobeRoutes from './routes/wardrobeRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';

dotenv.config();

connectDB();

const app = express();

// CORS configuration to allow requests from your frontend
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8080' , 'https://stylezap-wardrobe-ai.vercel.app' ], // 👈 Add your new port here
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json()); // To accept JSON data in the body

app.get('/', (req, res) => {
  res.send('StyleZAP! API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/outfits', outfitRoutes);
// ... existing imports


// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));