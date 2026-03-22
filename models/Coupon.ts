import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discount: number; // e.g., percentage discount or flat amount
  expiryDate: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
