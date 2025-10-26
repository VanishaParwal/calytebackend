import express from 'express';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById, // <-- Import the new function
} from '../controllers/journalController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// This line is crucial for security. It applies our authMiddleware
// to ALL routes defined in this file.
router.use(authMiddleware);

// A POST request to /api/journal will create an entry.
// A GET request to /api/journal will fetch all entries.
router.route('/').post(createJournalEntry).get(getJournalEntries);

// A GET request to /api/journal/:id will fetch a single entry by its ID.
router.route('/:id').get(getJournalEntryById);

export default router;
