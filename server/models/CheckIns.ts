import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckIn extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  checkInTime?: string;
  checkOutTime?: string;
}

const CheckInSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    checkInTime: { type: String },
    checkOutTime: { type: String },
  },
  { timestamps: true }
);

CheckInSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<ICheckIn>('CheckIn', CheckInSchema);
