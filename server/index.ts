import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Corrected import for dotenv
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import journalRoutes from './routes/journalRoutes'; // Import the new journal routes


// Import your API routes
import authRoutes from './routes/authRoutes';

// Immediately load environment variables from the .env file
dotenv.config();

// Initialize the Express application
const app: Express = express();
const PORT = process.env.PORT || 5001;

/**
 * An async function to start the server.
 * This ensures we connect to the database *before* the server starts listening for requests.
 */
const startServer = async () => {
  try {
    // Attempt to connect to MongoDB
    const dbConnected = await connectDB();

    // If the database connection fails, do not start the server
    if (!dbConnected) {
      console.error("❌ Server did not start due to database connection failure.");
      process.exit(1); // Exit the process with an error code
    }

    // --- MIDDLEWARE SETUP ---
    // Enable Cross-Origin Resource Sharing to allow your frontend to communicate with this backend
    app.use(cors({
      origin: 'http://localhost:3000', // IMPORTANT: Replace with your actual frontend URL
      credentials: true, // This allows cookies to be sent
    }));

    // Allow the server to parse incoming JSON data
    app.use(express.json());

    // Allow the server to parse cookies from requests
    app.use(cookieParser());


    // --- API ROUTES ---
    // Tell the application to use the auth routes for any URL starting with /api/users
    app.use('/api/users', authRoutes);


    // --- START LISTENING ---
    // Start the server and listen for incoming requests on the specified port
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ An unexpected error occurred during server startup:", error);
    process.exit(1);
  }
};

// Execute the function to start the server
startServer();

