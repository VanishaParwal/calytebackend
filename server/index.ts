import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';

// Import your routes
import authRoutes from './routes/authRoutes';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// API Routes
app.use('/api/users', authRoutes); // All routes from authRoutes will be prefixed with /api/users

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

