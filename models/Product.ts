import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  instructions: string;
  image: string;
  duration: string;
  deliverableType: 'Serials' | 'Service' | 'Dynamic';
  serials: string[];
  webhookUrl?: string;
  stock: number;
  reservedStock: number;
  deliveryMethod: 'First' | 'Last' | 'Random';
  visibility: 'Public' | 'Private' | 'Unlisted' | 'Onhold';
  currency: 'USD' | 'EUR';
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    instructions: { type: String, default: '' },
    image: { type: String, required: true },
    duration: { type: String, default: 'Lifetime' },
    deliverableType: { 
      type: String, 
      enum: ['Serials', 'Service', 'Dynamic'], 
      default: 'Serials' 
    },
    serials: { type: [String], default: [] },
    webhookUrl: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    deliveryMethod: { 
      type: String, 
      enum: ['First', 'Last', 'Random'], 
      default: 'Random' 
    },
    visibility: { 
      type: String, 
      enum: ['Public', 'Private', 'Unlisted', 'Onhold'], 
      default: 'Public' 
    },
    currency: { 
      type: String, 
      enum: ['USD', 'EUR'], 
      default: 'USD' 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
