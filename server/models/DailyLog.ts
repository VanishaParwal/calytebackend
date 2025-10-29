import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User'; // Import the User interface

// Interface defining the properties of a Daily Log document
export interface IDailyLog extends Document {
  user: IUser['_id']; // Reference to the user this log belongs to
  date: Date; // The specific day this log represents (will store YYYY-MM-DD at midnight UTC)
  waterIntake: number; // Counter for glasses of water
  loggedSleep: boolean; // Flag if sleep was logged
  loggedMeditation: boolean; // Flag if meditation was logged
  loggedExercise: boolean; // Flag if exercise was logged
}

const DailyLogSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    waterIntake: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Ensure counter doesn't go below zero
    },
    loggedSleep: {
      type: Boolean,
      required: true,
      default: false,
    },
    loggedMeditation: {
      type: Boolean,
      required: true,
      default: false,
    },
    loggedExercise: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create a unique index on user and date to ensure only one log per user per day
DailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);
