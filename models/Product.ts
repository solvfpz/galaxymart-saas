import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  duration: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, default: 'Lifetime' },
  },
  { timestamps: true }
);

// Delete the cached model if it exists so Next.js hot-reloads don't use the old schema without duration
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model<IProduct>('Product', ProductSchema);
