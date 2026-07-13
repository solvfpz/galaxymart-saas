<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard/stats
     *
     * Returns real-time dashboard statistics from MongoDB.
     */
    public function stats(): JsonResponse
    {
        try {
            $now = now();

            // Revenue calculations
            $revenueData = Order::raw(function ($collection) {
                return $collection->aggregate([
                    ['$match' => ['status' => ['$in' => ['paid', 'delivered']]]],
                    ['$group' => ['_id' => null, 'total' => ['$sum' => '$amount_usd']]],
                ]);
            })->toArray();
            $totalRevenue = $revenueData[0]['total'] ?? 0;

            // Current month revenue
            $monthRevenue = Order::raw(function ($collection) use ($now) {
                return $collection->aggregate([
                    ['$match' => [
                        'status' => ['$in' => ['paid', 'delivered']],
                        'created_at' => ['$gte' => $now->copy()->startOfMonth()->toDateTime()],
                    ]],
                    ['$group' => ['_id' => null, 'total' => ['$sum' => '$amount_usd']]],
                ]);
            })->toArray();
            $currentMonthRevenue = $monthRevenue[0]['total'] ?? 0;

            // Status counts
            $totalOrders = Order::count();
            $pendingOrders = Order::where('status', 'pending')->count();
            $paidOrders = Order::where('status', 'paid')->count();
            $deliveredOrders = Order::where('status', 'delivered')->count();
            $failedOrders = Order::whereIn('status', ['failed', 'expired'])->count();

            // Recent orders
            $recentOrders = Order::orderBy('created_at', 'desc')->limit(10)->get();

            // Top products by revenue
            $topProducts = Order::raw(function ($collection) {
                return $collection->aggregate([
                    ['$match' => ['status' => ['$in' => ['paid', 'delivered']]]],
                    ['$group' => [
                        '_id' => '$product_name',
                        'totalRevenue' => ['$sum' => '$amount_usd'],
                        'orderCount' => ['$sum' => 1],
                    ]],
                    ['$sort' => ['totalRevenue' => -1]],
                    ['$limit' => 10],
                ]);
            })->toArray();

            // Daily revenue for last 7 days
            $dailyRevenue = Order::raw(function ($collection) use ($now) {
                return $collection->aggregate([
                    ['$match' => [
                        'status' => ['$in' => ['paid', 'delivered']],
                        'created_at' => ['$gte' => $now->copy()->subDays(7)->startOfDay()->toDateTime()],
                    ]],
                    ['$group' => [
                        '_id' => ['$dateToString' => ['format' => '%Y-%m-%d', 'date' => '$created_at']],
                        'revenue' => ['$sum' => '$amount_usd'],
                        'orders' => ['$sum' => 1],
                    ]],
                    ['$sort' => ['_id' => 1]],
                ]);
            })->toArray();

            return response()->json([
                'success' => true,
                'stats' => [
                    'totalRevenue' => round($totalRevenue, 2),
                    'currentMonthRevenue' => round($currentMonthRevenue, 2),
                    'totalOrders' => $totalOrders,
                    'pendingOrders' => $pendingOrders,
                    'paidOrders' => $paidOrders,
                    'deliveredOrders' => $deliveredOrders,
                    'failedOrders' => $failedOrders,
                ],
                'dailyRevenue' => $dailyRevenue,
                'recentOrders' => $recentOrders,
                'topProducts' => $topProducts,
            ]);
        } catch (\Throwable $e) {
            Log::error('Dashboard stats error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard statistics.',
            ], 500);
        }
    }
}
