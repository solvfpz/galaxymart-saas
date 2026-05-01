const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://in7lux_db_user:fRGDD3d76GaqGRxG@cluster0.m3xbood.mongodb.net/galaxymart?retryWrites=true&w=majority';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const ReviewSchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    email: String,
    rating: Number,
    comment: String,
  }, { timestamps: true });

  const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

  // Clear existing reviews to avoid index conflicts
  await Review.deleteMany({});

  // Get a product ID if possible, otherwise use a fake one
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}));
  const product = await Product.findOne();
  const productId = product ? product._id : new mongoose.Types.ObjectId();

  await Review.create([
    {
      productId,
      email: "alex.mercer@gmail.com",
      rating: 5,
      comment: "Absolutely phenomenal service. The automated delivery system is flawless. I received my order in seconds. Highly recommend to anyone looking for quality!"
    },
    {
      productId,
      email: "sarah.j@outlook.com",
      rating: 5,
      comment: "I've been using this platform for months. The new dashboard updates are great. Smooth experience every time. Customer support is also very responsive."
    },
    {
      productId,
      email: "m.thorne@protonmail.com",
      rating: 4,
      comment: "Great quality and very competitive prices. The review system is clean and straightforward. Minor lag in the past but feels super snappy now!"
    },
    {
      productId,
      email: "dev.user@yahoo.com",
      rating: 5,
      comment: "Best SaaS product in the market for this niche. Everything is automated and works out of the box. The UI is clean and modern."
    }
  ]);

  console.log('Seeded new refactored reviews');
  process.exit(0);
}

seed();
