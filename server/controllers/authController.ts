import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => { ... };
export const login = async (req: Request, res: Response) => { ... };
export const logout = async (req: Request, res: Response) => { ... };
export const getMe = async (req: AuthRequest, res: Response) => { ... };
// Helper function to generate a JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, sobrietyStartDate } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 2. Create the new user in the database
    const user: IUser = await User.create({
      name,
      email,
      password,
      sobrietyStartDate,
    });

    // 3. If user was created successfully, send back user data and a token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

