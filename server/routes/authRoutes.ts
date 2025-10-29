import express from 'express';
// Import all necessary controller functions
import {
  signup,
  login,
  logout,
  getMe,
  addEmergencyContact,
  removeEmergencyContact
} from '../controllers/authController';
// Import the middleware to protect routes
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// --- Public Routes ---
// Route for new user registration
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route for user logout (clears cookie)
router.post('/logout', logout); // Often POST or GET, POST is slightly more conventional for logout actions

// --- Protected Routes ---
// These routes require a valid JWT token (checked by authMiddleware)

// Route to get the currently logged-in user's profile information
// IMPORTANT: Place specific routes like /me/contacts BEFORE more general routes like /me
router.route('/me/contacts')
  .post(authMiddleware, addEmergencyContact); // Add a new emergency contact

router.route('/me/contacts/:contactId') // Route expects a contact ID in the URL
  .delete(authMiddleware, removeEmergencyContact); // Remove a specific contact

// Route to get the currently logged-in user's profile
router.route('/me').get(authMiddleware, getMe);

export default router;

