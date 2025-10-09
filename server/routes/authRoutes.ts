import express from 'express';
import { signup, login, logout, getMe } from '../controllers/authController';
// --- FIX IS HERE ---
import { authMiddleware } from '../middleware/auth'; // Changed 'protect' to 'authMiddleware'
// --------------------

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected route
// --- AND HERE ---
router.get('/me', authMiddleware, getMe); // Changed 'protect' to 'authMiddleware'
// ----------------

export default router;

