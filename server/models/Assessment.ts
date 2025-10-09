import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  substance: string;
  sobrietyDate: string;
  triggers: string;
  support: string;
  goals: string;
  createdAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    substance: { type: String, required: true },
    sobrietyDate: { type: String, required: true },
    triggers: { type: String, required: true },
    support: { type: String, required: true },
    goals: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
