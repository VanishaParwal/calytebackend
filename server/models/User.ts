import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. We are RE-ADDING the exported IUser interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  sobrietyStartDate: Date;
  substanceType?: string;
  hasCompletedAssessment: boolean;
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

// Add the password hashing middleware back (as it was in our previous logic)
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  // We use 'as string' to solve the TypeScript type error
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

// 2. We are USING the 'export default' that the controller expects
export default mongoose.model<IUser>('User', UserSchema);

