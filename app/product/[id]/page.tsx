import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { ProductDetailPage } from '@/components/Landing';

export const revalidate = 0;

export default async function Page() {
  let products: any[] = [];

  try {
    await dbConnect();
    // Fetch products
    products = await Product.find({}).lean();
    
    // Serialize
    products = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));
  } catch (err) {
    console.error('ProductDetailPage DB Connection Error:', err);
  }

  return (
    <ProductDetailPage dbProducts={products} />
  );
}
