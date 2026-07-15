import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'pending' | 'waiting' | 'confirming' | 'confirmed' | 'delivered' | 'expired' | 'failed' | 'manual_paid' | 'manual_delivered';

export interface IPayment extends Document {
  payment_id: string;
  order_id: mongoose.Types.ObjectId;
  invoice_id: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  price_amount: number;
  price_currency: string;
  tx_hash?: string;
  confirmation_count: number;
  paid_amount?: number;
  actually_paid?: number;
  payment_status: PaymentStatus;
  nowpayments_payment_id?: string;
  created_at: Date;
  paid_at?: Date;
  confirmed_at?: Date;
  delivered_at?: Date;
  expired_at?: Date;
  last_checked_at?: Date;
  provider_response?: any;
  ipn_processed: boolean;
  ipn_processed_at?: Date;
  duplicate_ipn_count: number;
}

const PaymentSchema: Schema = new Schema(
  {
    payment_id: { type: String, required: true, unique: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    invoice_id: { type: String, required: true },
    pay_address: { type: String, required: true },
    pay_amount: { type: Number, required: true },
    pay_currency: { type: String, default: 'ltc' },
    price_amount: { type: Number, required: true },
    price_currency: { type: String, default: 'usd' },
    tx_hash: { type: String, sparse: true },
    confirmation_count: { type: Number, default: 0 },
    paid_amount: { type: Number },
    actually_paid: { type: Number },
    payment_status: {
      type: String,
      enum: ['pending', 'waiting', 'confirming', 'confirmed', 'delivered', 'expired', 'failed', 'manual_paid', 'manual_delivered'],
      default: 'pending',
    },
    nowpayments_payment_id: { type: String },
    created_at: { type: Date, default: Date.now },
    paid_at: { type: Date },
    confirmed_at: { type: Date },
    delivered_at: { type: Date },
    expired_at: { type: Date },
    last_checked_at: { type: Date },
    provider_response: { type: Schema.Types.Mixed },
    ipn_processed: { type: Boolean, default: false },
    ipn_processed_at: { type: Date },
    duplicate_ipn_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PaymentSchema.index({ nowpayments_payment_id: 1 });
PaymentSchema.index({ invoice_id: 1 });
PaymentSchema.index({ payment_status: 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
