import { Response } from 'express';
// Import your Activity model (make sure the path is correct)
import Activity from '../models/Activity';
// Import the custom request type that includes userId from the auth middleware
import { AuthRequest } from '../middleware/auth';

/**
 * Helper function to get the start of the current day (midnight UTC).
 * This ensures logs are consistently associated with a specific date regardless of timezones.
 * @param date Optional date object, defaults to now.
 * @returns Date object set to the beginning of the day in UTC.
 */
const getStartOfDayUTC = (date: Date = new Date()): Date => {
  const startOfDay = new Date(date);
  // Sets the time to 00:00:00.000 UTC for the given date
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * @desc    Log or update an activity for the current day for the logged-in user.
 * Creates a new daily log if one doesn't exist.
 * @route   POST /api/activity
 * @access  Private (requires authentication token)
 */
export const logActivity = async (req: AuthRequest, res: Response) => {
  try {
    // Get the user ID attached by the authMiddleware
    const userId = req.userId;
    // Get the type of activity and optional value from the request body
    const { activityType, value } = req.body; // e.g., { "activityType": "water" } or { "activityType": "sleep", "value": 7 }
    const todayStartUTC = getStartOfDayUTC(); // Get the start of today in UTC

    // Validate input
    if (!activityType) {
      return res.status(400).json({ message: 'Activity type is required.' });
    }

    let updateOperation = {}; // This object will define the MongoDB update

    // Determine the update operation based on the activity type
    switch (activityType.toLowerCase()) { // Use toLowerCase for case-insensitivity
      case 'water':
        // Increment the waterGlasses counter by 1
        updateOperation = { $inc: { waterGlasses: 1 } };
        break;
      case 'sleep':
        // Set sleepHours. Use provided value or a default (e.g., 8).
        updateOperation = { sleepHours: typeof value === 'number' && value >= 0 ? value : 8 };
        break;
      case 'meditation':
        // Set meditationMinutes. Use provided value or a default (e.g., 10).
        updateOperation = { meditationMinutes: typeof value === 'number' && value >= 0 ? value : 10 };
        break;
      case 'exercise':
        // Set exerciseMinutes. Use provided value or a default (e.g., 30).
        updateOperation = { exerciseMinutes: typeof value === 'number' && value >= 0 ? value : 30 };
        break;
      case 'checkin': // Handle checkIn
        // Set the checkInTime to the current server time
        updateOperation = { checkInTime: new Date() };
        break;
      case 'checkout': // Handle checkOut
        // Set the checkOutTime to the current server time
        updateOperation = { checkOutTime: new Date() };
        break;
      default:
        // If activityType doesn't match known types, return an error
        return res.status(400).json({ message: 'Invalid activity type provided.' });
    }

    // Find the activity log for today for this user, apply the update,
    // or create a new log if it doesn't exist (upsert: true).
    // Return the modified document (new: true).
    // setDefaultsOnInsert ensures our schema defaults (like 0 for counters) are applied on creation.
    const updatedActivityLog = await Activity.findOneAndUpdate(
      { userId: userId, date: todayStartUTC }, // Find document matching user and today's date
      updateOperation, // Apply the specific update for the activity
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options
    );

    // Send the updated activity log back to the client
    res.status(200).json(updatedActivityLog);

  } catch (error: any) {
    console.error('Error logging activity:', error);
    // Handle potential validation errors from Mongoose schema
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while logging activity.' });
  }
};

/**
 * @desc    Get the daily activity log for the current day for the logged-in user.
 * @route   GET /api/activity
 * @access  Private (requires authentication token)
 */
export const getActivityLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; // Get user ID from authMiddleware
    const todayStartUTC = getStartOfDayUTC(); // Get the start of today in UTC

    // Find the activity log for this user for today's date
    const activityLog = await Activity.findOne({ userId: userId, date: todayStartUTC });

    // If no log exists for today yet, return a default object
    // This provides a consistent structure for the frontend.
    if (!activityLog) {
      return res.status(200).json({
        // Mimic the structure but indicate it's not a saved document
        _id: null,
        userId: userId,
        date: todayStartUTC,
        waterGlasses: 0,
        sleepHours: 0,
        meditationMinutes: 0,
        exerciseMinutes: 0,
        checkInTime: null,
        checkOutTime: null,
        // timestamps will be null as it's not saved
        createdAt: null,
        updatedAt: null,
      });
    }

    // If a log was found, return it
    res.status(200).json(activityLog);

  } catch (error) {
    console.error('Error fetching daily activity log:', error);
    res.status(500).json({ message: 'Server error while fetching activity log.' });
  }
};

