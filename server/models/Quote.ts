import mongoose, { Schema, Document } from 'mongoose';

    export interface IQuote extends Document {
      text: string;
      // You could add fields like author, category, etc.
    }

    const QuoteSchema: Schema = new Schema({
      text: { type: String, required: true, unique: true }, // Ensure quotes are unique
    }, { timestamps: true });

    export default mongoose.model<IQuote>('Quote', QuoteSchema);