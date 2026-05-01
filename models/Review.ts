import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  email: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, minlength: 10 },
  },
  { timestamps: true }
);

// Prevent multiple reviews from the same email for the same product
ReviewSchema.index({ productId: 1, email: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
