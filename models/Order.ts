import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  productId: mongoose.Types.ObjectId;
  customerEmail: string;
  txId?: string;
  status: 'pending' | 'detected' | 'confirming' | 'confirmed' | 'manual' | 'delivered' | 'expired' | 'failed';
  paymentStatus: 'unpaid' | 'paid';
  quantity: number;
  amount: number;
  usdAmount: number;
  ltcAmount: number;
  ltcPriceAtTime: number;
  paymentId: string;
  walletAddress: string;
  expiresAt: Date;
  nowPaymentId?: string;
  payAddress?: string;
  payAmount?: number;
  payCurrency?: string;
  paymentProvider?: string;
  deliveredSerials?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    customerEmail: { type: String, required: true },
    txId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['pending', 'detected', 'confirming', 'confirmed', 'manual', 'delivered', 'expired', 'failed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    quantity: { type: Number, default: 1 },
    amount: { type: Number, required: true },
    usdAmount: { type: Number, required: true },
    ltcAmount: { type: Number, required: true },
    ltcPriceAtTime: { type: Number, required: true },
    paymentId: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    nowPaymentId: { type: String },
    payAddress: { type: String },
    payAmount: { type: Number },
    payCurrency: { type: String, default: 'ltc' },
    paymentProvider: { type: String, default: 'nowpayments' },
    deliveredSerials: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
