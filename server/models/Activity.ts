import mongoose, { Schema, Document } from 'mongoose';

// Interface defining the properties of an Activity document
export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User
  date: Date; // The specific day this log represents (YYYY-MM-DD at midnight UTC)
  waterGlasses: number; // Counter for glasses of water
  sleepHours: number; // Hours slept (can be 0 if not logged)
  meditationMinutes: number; // Minutes meditated (can be 0 if not logged)
  exerciseMinutes: number; // Minutes exercised (can be 0 if not logged)
  checkInTime?: Date; // Optional: Timestamp when the user checked in
  checkOutTime?: Date; // Optional: Timestamp when the user checked out
}

// Mongoose schema definition
const ActivitySchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Link to the User model
      required: true,
    },
    date: {
      type: Date,
      required: true, // The date is essential for querying daily logs
    },
    waterGlasses: {
      type: Number,
      default: 0, // Default to 0 glasses
      min: 0,
    },
    sleepHours: {
      type: Number,
      default: 0, // Default to 0 hours
      min: 0,
    },
    meditationMinutes: {
      type: Number,
      default: 0, // Default to 0 minutes
      min: 0,
    },
    exerciseMinutes: {
      type: Number,
      default: 0, // Default to 0 minutes
      min: 0,
    },
    checkInTime: {
      type: Date, // Store as a full Date object
      required: false, // Make it optional
    },
    checkOutTime: {
      type: Date, // Store as a full Date object
      required: false, // Make it optional
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create a compound unique index to ensure only one activity log per user per day
// This prevents duplicate entries for the same user on the same date.
ActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

// Export the Mongoose model
export default mongoose.model<IActivity>('Activity', ActivitySchema);

