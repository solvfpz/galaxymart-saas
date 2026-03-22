import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Landing from '@/components/Landing';

export const revalidate = 0; // Disable static rendering for realtime storefront

export default async function Page() {
  let products: any[] = [];

  try {
    await dbConnect();
    // Fetch products from database
    products = await Product.find({}).sort({ createdAt: -1 }).lean();
    
    // Serialize ObjectIds to strings
    products = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));
  } catch (err) {
    console.error('Storefront DB Connection Error:', err);
  }

  return (
    <Landing dbProducts={products} />
  );
}
