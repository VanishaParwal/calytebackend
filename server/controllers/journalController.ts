import { Response } from 'express';
// We are using the default export from your correct User model
import JournalEntry from '../models/JournalEntry';
// Import our custom request type to get access to req.userId
import { AuthRequest } from '../middleware/auth';
import Sentiment from 'sentiment';
import mongoose from 'mongoose'; // Import mongoose for ID validation

// Initialize the sentiment analyzer once
const sentiment = new Sentiment();

/**
 * @desc    Create a new journal entry for the logged-in user
 * @route   POST /api/journal
 * @access  Private (ensured by the router)
 */
export const createJournalEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { content, mood } = req.body;
    // req.userId is available because our router uses the authMiddleware
    const userId = req.userId;

    if (!content || !mood) {
      return res
        .status(400)
        .json({ message: 'Please provide content and a mood.' });
    }

    // Perform sentiment analysis on the journal content
    const analysisResult = sentiment.analyze(content);

    // Create the new journal entry in the database
    const newEntry = new JournalEntry({
      user: userId,
      content,
      mood,
      sentimentScore: analysisResult.score, // Save the calculated score
    });

    await newEntry.save();
    // Send the newly created entry back to the frontend
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all journal entries for the logged-in user
 * @route   GET /api/journal
 * @access  Private (ensured by the router)
 */
export const getJournalEntries = async (req: AuthRequest, res: Response) => {
  try {
    // req.userId is available because our router uses the authMiddleware
    const userId = req.userId;

    // Find all entries for this user and sort them with the newest first
    const entries = await JournalEntry.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single journal entry by its ID
 * @route   GET /api/journal/:id
 * @access  Private
 */
export const getJournalEntryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid journal entry ID.' });
    }

    const entry = await JournalEntry.findById(id);

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found.' });
    }

    // Security check: Make sure the logged-in user owns this entry
    // THIS IS THE FIX: We add 'as any' to solve the TypeScript error
    if ((entry.user as any).toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'User not authorized to view this entry.' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

