import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  orderId: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'hidden';
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, default: '' },
    orderId: { type: String, default: '' },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, minlength: 10 },
    status: { type: String, enum: ['pending', 'approved', 'hidden'], default: 'pending' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent multiple reviews for the same order (email+product duplicates are allowed)
ReviewSchema.index({ orderId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
