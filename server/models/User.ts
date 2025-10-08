import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs'; // <-- ADD THIS IMPORT

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  sobrietyStartDate: Date;
  substanceType?: string;
  hasCompletedAssessment: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    sobrietyStartDate: { type: Date, default: Date.now },
    substanceType: { type: String },
    hasCompletedAssessment: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// --- ADD THIS MIDDLEWARE ---
// Before a user document is saved, this function will run and hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});
// -------------------------

export default mongoose.model<IUser>('User', UserSchema);

