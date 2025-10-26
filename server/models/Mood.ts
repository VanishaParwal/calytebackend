import mongoose, { Schema, Document } from 'mongoose';

export interface IMood extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  mood: 'great' | 'good' | 'okay' | 'down' | 'struggling';
  createdAt: Date;
}

const MoodSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    mood: { 
      type: String, 
      enum: ['great', 'good', 'okay', 'down', 'struggling'], 
      required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMood>('Mood', MoodSchema);
