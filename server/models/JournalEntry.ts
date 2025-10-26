import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User'; // Import the User interface

// Interface defining the properties of a Journal Entry document
export interface IJournalEntry extends Document {
  user: IUser['_id']; // Reference to the user who wrote it
  content: string; // The text content of the journal
  mood: string; // The user-reported mood for the entry
  sentimentScore: number; // The calculated sentiment score
}

const JournalEntrySchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a link to the User model
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ['Happy', 'Sad', 'Neutral', 'Anxious', 'Calm', 'Proud'], // Example moods
    },
    sentimentScore: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// This is the default export that was being looked for
export default mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

