import { Response } from 'express';
// Ensure User model is imported correctly
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
// Import the helper functions from our utility file
import { calculateSoberDays, getMilestones } from '../utils/streak';

/**
 * @desc    Get core dashboard data (user info, streak, milestones, contacts)
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    // Fetch user data, now explicitly including emergencyContacts
    const user = await User.findById(userId).select(
      'name email sobrietyStartDate substanceType emergencyContacts' // <-- Added emergencyContacts here
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate streak using the utility function
    const soberDays = user.sobrietyStartDate ? calculateSoberDays(user.sobrietyStartDate) : 0;
    // Get achieved milestones using the utility function
    const milestones = getMilestones(soberDays);

    // Send the combined data back
    res.json({
      soberDays,
      milestones,
      user: { // Send relevant user details
        name: user.name,
        email: user.email,
        sobrietyStartDate: user.sobrietyStartDate,
        substanceType: user.substanceType,
        emergencyContacts: user.emergencyContacts, // <-- Include contacts in the response
      },
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

