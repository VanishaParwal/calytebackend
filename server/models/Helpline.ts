    import mongoose, { Schema, Document } from 'mongoose';

    export interface IHelpline extends Document {
      name: string;
      phone: string;
      description: string;
      scope: string; // e.g., 'India', 'MP'
      // You could add more fields like website, hours, etc.
    }

    const HelplineSchema: Schema = new Schema({
      name: { type: String, required: true },
      phone: { type: String, required: true },
      description: { type: String, required: true },
      scope: { type: String, required: true, index: true }, // Index for faster filtering
    }, { timestamps: true });

    export default mongoose.model<IHelpline>('Helpline', HelplineSchema);
    
