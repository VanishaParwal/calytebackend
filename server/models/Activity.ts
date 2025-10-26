import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  waterGlasses: number;
  sleepHours: number;
  meditationMinutes: number;
  exerciseMinutes: number;
}

const ActivitySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    waterGlasses: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    meditationMinutes: { type: Number, default: 0 },
    exerciseMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create compound index for userId and date to ensure one activity record per day per user
ActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
