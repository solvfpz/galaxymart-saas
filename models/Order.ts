import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  productId: mongoose.Types.ObjectId;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'expired' | 'manual_paid' | 'paid';
  quantity: number;
  amount: number;
  usdAmount: number;
  ltcAmount: number;
  ltcPriceAtTime: number;
  paymentId: string;
  walletAddress: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    customerEmail: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'expired', 'manual_paid', 'paid'], default: 'pending' },
    quantity: { type: Number, default: 1 },
    amount: { type: Number, required: true },
    usdAmount: { type: Number, required: true },
    ltcAmount: { type: Number, required: true },
    ltcPriceAtTime: { type: Number, required: true },
    paymentId: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
