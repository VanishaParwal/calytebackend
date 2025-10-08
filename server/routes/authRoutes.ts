import express from 'express';
import { signup, login, logout, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth'; // We will create this next

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected route
// Only a logged-in user can access this route
router.get('/me', protect, getMe);

export default router;

