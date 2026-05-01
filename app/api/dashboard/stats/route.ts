import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { startOfMonth, subMonths, startOfDay, subDays } from 'date-fns';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const sevenDaysAgo = startOfDay(subDays(now, 6));

    const currentMonthRevenueData = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'delivered'] }, createdAt: { $gte: currentMonthStart } } },
      { $group: { _id: null, total: { $sum: '$usdAmount' } } }
    ]);
    const lastMonthRevenueData = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'delivered'] }, createdAt: { $gte: lastMonthStart, $lt: currentMonthStart } } },
      { $group: { _id: null, total: { $sum: '$usdAmount' } } }
    ]);

    const currentRevenue = currentMonthRevenueData[0]?.total || 0;
    const lastRevenue = lastMonthRevenueData[0]?.total || 0;
    const revenueGrowth = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

    const allTimeRevenueData = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$usdAmount' } } }
    ]);
    const totalRevenue = allTimeRevenueData[0]?.total || 0;

    const currentMonthOrders = await Order.countDocuments({ createdAt: { $gte: currentMonthStart } });
    const lastMonthOrders = await Order.countDocuments({ createdAt: { $gte: lastMonthStart, $lt: currentMonthStart } });
    const totalOrders = await Order.countDocuments({});
    const ordersGrowth = lastMonthOrders === 0 ? 100 : ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;

    const totalProducts = await Product.countDocuments({});
    const activeProducts = await Product.countDocuments({ visibility: 'Public' });

    const dailyRevenue = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'delivered'] }, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$usdAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $count: {} }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];
      
      const rev = dailyRevenue.find(d => d._id === dateStr)?.revenue || 0;
      const ord = dailyOrders.find(d => d._id === dateStr)?.orders || 0;
      
      return { date: dayName, revenue: rev, orders: ord, fullDate: dateStr };
    });

    const latestOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerEmail paymentId usdAmount createdAt status');

    const topProducts = await Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'delivered'] } } },
        {
          $group: {
            _id: "$productId",
            salesCount: { $count: {} },
            totalRevenue: { $sum: "$usdAmount" }
          }
        },
        { $sort: { salesCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            name: '$product.name',
            salesCount: 1,
            totalRevenue: 1
          }
        }
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        revenueGrowth,
        totalOrders,
        ordersGrowth,
        totalProducts,
        activeProducts,
      },
      charts: {
        last7Days,
      },
      latestOrders,
      topProducts
    });

  } catch (error: any) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
