import express from 'express';
// Import the controller functions from activityController.ts
import { logActivity, getActivityLog } from '../controllers/activityController';
// Import the authentication middleware
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply the authentication middleware to protect all routes in this file
// Only logged-in users can log or view activities.
router.use(authMiddleware);

// Define the routes:
// POST /api/activity -> Calls logActivity to record a new activity
// GET /api/activity  -> Calls getActivityLog to fetch today's activity log
router.route('/').post(logActivity).get(getActivityLog);

export default router;

