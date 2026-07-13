<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * POST /api/orders/{orderId}/status
     *
     * Manually override the status of an order (admin action).
     * Body: status (string, required) - one of: paid, failed, expired, delivered
     */
    public function updateStatus(Request $request, string $orderId): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:paid,failed,expired,delivered',
            'notes' => 'nullable|string|max:500',
        ]);

        $order = Order::where('order_id', $orderId)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        $previousStatus = $order->status;
        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        if (!empty($validated['notes'])) {
            $updateData['notes'] = $validated['notes'];
        }

        $order->update($updateData);

        Log::info("Order {$orderId} status updated manually", [
            'from' => $previousStatus,
            'to' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'order_id' => $order->order_id,
            'status' => $order->status,
            'previous_status' => $previousStatus,
        ]);
    }

    /**
     * GET /api/orders/{orderId}
     *
     * Get order details.
     */
    public function show(string $orderId): JsonResponse
    {
        $order = Order::where('order_id', $orderId)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order->toArray(),
        ]);
    }
}
