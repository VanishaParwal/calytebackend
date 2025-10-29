import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
// Import Mongoose for ObjectId validation
import mongoose from 'mongoose';
// Import User model and IUser interface
import User, { IUser } from '../models/User';
// Import helper functions/types
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * @desc    Register a new user
 * @route   POST /api/users/signup
 * @access  Public
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Sanitize email for query
    const userEmail = String(email);
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user instance (password will be hashed by pre-save hook)
    const user = new User({
      name,
      email: userEmail,
      password,
      sobrietyStartDate: new Date(), // Set default start date on signup
    });

    // Save the user (triggers pre-save hook for hashing)
    await user.save();

    // Generate JWT token - Use the virtual 'id' property which is a string
    const token = generateToken(user.id); // <-- FIX: Use user.id

    // Set token in HTTP-Only cookie for security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
      sameSite: 'strict', // Helps prevent CSRF attacks
    });

    // Send successful response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id, // <-- FIX: Use user.id
        name: user.name,
        email: user.email,
        hasCompletedAssessment: user.hasCompletedAssessment,
      },
      token, // Also send token in body if needed by frontend client state
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Sanitize email for query
    const userEmail = String(email);
    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Generic message for security
    }

    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Generic message
    }

    // Generate JWT token - Use the virtual 'id' property which is a string
    const token = generateToken(user.id); // <-- FIX: Use user.id

    // Set token in HTTP-Only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
    });

    // Send successful login response
    res.json({
      message: 'Login successful',
      user: {
        id: user.id, // <-- FIX: Use user.id
        name: user.name,
        email: user.email,
        hasCompletedAssessment: user.hasCompletedAssessment,
        sobrietyStartDate: user.sobrietyStartDate,
      },
      token, // Send token in body as well
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * @desc    Log user out
 * @route   POST /api/users/logout
 * @access  Public (or Private, depending on app logic)
 */
export const logout = async (req: Request, res: Response) => {
  // Clear the authentication cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    // req.userId is added by the authMiddleware
    // Fetch user data, excluding the password field for security
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      // This case should rarely happen if token is valid, but good to check
      return res.status(404).json({ message: 'User not found' });
    }
    // Return the user profile data
    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};


/**
 * @desc    Add an emergency contact for the logged-in user
 * @route   POST /api/users/me/contacts
 * @access  Private
 */
export const addEmergencyContact = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, relationship } = req.body;
    const userId = req.userId;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({ message: 'Contact name and phone are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if contact limit is reached
    if (user.emergencyContacts.length >= 2) {
      return res.status(400).json({ message: 'Cannot add more than 2 emergency contacts.' });
    }

    // Add the new contact to the array
    user.emergencyContacts.push({ name, phone, relationship });
    // Save the user document with the new contact
    await user.save();

    // Return the updated list of conacts
    res.status(201).json(user.emergencyContacts);

  } catch (error: any) {
    console.error('Add emergency contact error:', error);
    if (error.name === 'ValidationError') { // Handle Mongoose validation errors (e.g., array limit)
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error adding emergency contact.' });
  }
};

/**
 * @desc    Remove an emergency contact for the logged-in user by its ID
 * @route   DELETE /api/users/me/contacts/:contactId
 * @access  Private
 */
export const removeEmergencyContact = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const contactId = req.params.contactId; // Get contactId from URL parameter

    // --- FIX: Validate the contactId format ---
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialLength = user.emergencyContacts.length;

    // --- FIX: Use filter() instead of pull() ---
    // Create a new array containing only the contacts whose _id does NOT match the one to remove
    user.emergencyContacts = user.emergencyContacts.filter(
      (contact: any) => contact._id.toString() !== contactId
    );

    // Check if a contact was actually removed
    if (user.emergencyContacts.length === initialLength) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    // Save the user document with the modified contacts array
    await user.save();

    // Return the updated list of contacts
    res.status(200).json(user.emergencyContacts);

  } catch (error) {
    console.error('Remove emergency contact error:', error);
    res.status(500).json({ message: 'Server error removing emergency contact.' });
  }
};

