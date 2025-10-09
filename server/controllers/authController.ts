import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

/**
 * @desc    Register a new user (signup)
 * @route   POST /api/users/signup
 * @access  Public
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, sobrietyStartDate } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user instance. The password will be hashed by the pre-save hook in User.ts
    const user = new User({
      name,
      email,
      password,
      sobrietyStartDate: sobrietyStartDate || new Date(),
    });

    await user.save();

    // Generate a token for the new user
    const token = generateToken(user.id.toString());

    // Set the token in an HTTP-only cookie for security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send back a success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompletedAssessment: user.hasCompletedAssessment,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

/**
 * @desc    Authenticate user & get token (login)
 * @route   POST /api/users/login
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare entered password with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompletedAssessment: user.hasCompletedAssessment,
        sobrietyStartDate: user.sobrietyStartDate,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    // req.userId is attached by the authMiddleware
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

