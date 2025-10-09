import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyContact extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  relation: string;
  phone: string;
  createdAt: Date;
}

const EmergencyContactSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
