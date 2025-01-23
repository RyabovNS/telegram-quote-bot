import mongoose, { Document, Schema } from "mongoose";

export interface Quote extends Document {
  author: string;
  text: string;
}

const QuoteSchema = new Schema<Quote>({
  author: { type: String, required: true },
  text: { type: String, required: true },
});

export const QuoteModel = mongoose.model<Quote>("Quote", QuoteSchema);
