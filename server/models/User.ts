import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the structure for an emergency contact sub-document
interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string; // Optional relationship field
}

// Define the main User interface, including the emergency contacts array
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  sobrietyStartDate: Date;
  substanceType?: string;
  hasCompletedAssessment: boolean;
  emergencyContacts: EmergencyContact[]; // Array to store contacts
}

// Define the Mongoose schema for the EmergencyContact sub-document
const EmergencyContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }, // Consider adding phone number validation
  relationship: { type: String },
}, { _id: true }); // Ensure each embedded contact gets its own unique _id

// Define the main User schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    sobrietyStartDate: { type: Date, default: Date.now },
    substanceType: { type: String },
    hasCompletedAssessment: { type: Boolean, default: false },
    // Define the emergencyContacts field as an array of the sub-schema
    emergencyContacts: {
      type: [EmergencyContactSchema],
      validate: [ // Add validation to limit the array size to 2
        (val: EmergencyContact[]) => val.length <= 2,
        '{PATH} exceeds the limit of 2' // Error message if validation fails
      ],
      default: [] // Default to an empty array
    }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Middleware to hash the password before saving a user document
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    // Use 'as string' to satisfy TypeScript's type checking for the hash function
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    // Pass error to the next middleware/error handler
    next(error);
  }
});

// Export the User model with the defined schema and interface
export default mongoose.model<IUser>('User', UserSchema);

