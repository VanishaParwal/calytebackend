import express from 'express';
// Import the single function from the refactored controller
import { getDashboardData } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Protect all dashboard routes
router.use(authMiddleware);

// Define the single route to get the dashboard data
router.route('/').get(getDashboardData); // Changed from '/stats' to '/' for simplicity

export default router;

