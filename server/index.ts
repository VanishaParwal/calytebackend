import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import journalRoutes from './routes/journalRoutes';
import dashboardRoutes from './routes/dashboardRoutes'; // Route for core dashboard data
import activityRoutes from './routes/activityRoutes'; // Route for daily activity logs

import Helpline from './models/Helpline'; // Import models
import Quote from './models/Quote';
import { helplinesData, motivationalQuotesData } from './config/seedData'; // Assume you move arrays to a config file
import { connect } from 'http2';


// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;

// --- Middleware Setup ---
// Enable CORS for frontend communication
app.use(cors());
// Parse JSON request bodies
app.use(express.json());
// Parse cookies from requests
app.use(cookieParser());

// --- API Routes Setup ---
// Mount the different route handlers onto specific base paths
app.use('/api/users', authRoutes); // Authentication routes
app.use('/api/journal', journalRoutes); // Journaling routes
app.use('/api/dashboard', dashboardRoutes); // Core dashboard data route
app.use('/api/activity', activityRoutes); // Daily activity logging routes

// --- Start Server ---
/**
 * Asynchronously starts the server after ensuring database connection.
 */
const startServer = async () => {
  const seedDatabase = async () => {
  try {
    // Check if Helplines exist
    const helplineCount = await Helpline.countDocuments();
    if (helplineCount === 0) {
      console.log(' Seeding Helplines...');
      await Helpline.insertMany(helplinesData); // Use data from seedData.ts
      console.log(' Helplines seeded.');
    }

    // Check if Quotes exist
    const quoteCount = await Quote.countDocuments();
    if (quoteCount === 0) {
      console.log(' Seeding Quotes...');
      await Quote.insertMany(motivationalQuotesData.map(q => ({ text: q }))); // Map quotes to schema
      console.log(' Quotes seeded.');
    }
  } catch (error) {
    console.error(' Error during database seeding:', error);
  }
};

  try {
    const dbConnected = await connectDB();
    if (dbConnected) {
      // Seed after successful DB connection
      await seedDatabase();
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    } else {
      // This should ideally be handled within connectDB, but provides a fallback
      throw new Error('Database connection failed, server cannot start.');
    }
  } catch (error) {
    console.error('Server failed to start:', error);
    // Exit process with failure code if server cannot initialize
    process.exit(1);
  }
};

// Initiate the server startup sequence
startServer();



