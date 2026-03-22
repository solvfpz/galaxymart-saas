import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  productId: mongoose.Types.ObjectId;
  customerEmail: string;
  status: 'pending' | 'confirmed';
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    customerEmail: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
