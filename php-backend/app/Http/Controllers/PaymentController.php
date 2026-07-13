<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\NOWPaymentsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function __construct(
        protected NOWPaymentsService $nowpayments
    ) {}

    /**
     * POST /api/create-payment
     *
     * Creates a NOWPayments invoice and returns a unique LTC address for the order.
     * Stores expires_at (30 minutes) for auto-expiration tracking.
     */
    public function createPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'amount_usd' => 'required|numeric|min:0.01|max:999999.99',
        ]);

        try {
            $orderId = 'ORD-' . strtoupper(Str::random(12));

            // Check for duplicate order_id
            if (Order::where('order_id', $orderId)->exists()) {
                $orderId = 'ORD-' . strtoupper(Str::random(16));
            }

            $payment = $this->nowpayments->createPayment(
                amountUSD: (float) $validated['amount_usd'],
                orderId: $orderId,
                orderDescription: $validated['product_name']
            );

            // Check for duplicate NOWPayments payment ID
            if (Order::where('nowpayments_payment_id', $payment['payment_id'])->exists()) {
                Log::warning('Duplicate NOWPayments payment_id detected', [
                    'payment_id' => $payment['payment_id'],
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Payment already exists. Please try again.',
                ], 409);
            }

            $order = Order::create([
                'order_id' => $orderId,
                'product_name' => $validated['product_name'],
                'amount_usd' => (float) $validated['amount_usd'],
                'amount_ltc' => $payment['pay_amount'],
                'payment_address' => $payment['pay_address'],
                'nowpayments_payment_id' => $payment['payment_id'],
                'status' => 'pending',
                'expires_at' => now()->addMinutes(30),
            ]);

            return response()->json([
                'success' => true,
                'order_id' => $order->order_id,
                'payment_address' => $payment['pay_address'],
                'amount_ltc' => $payment['pay_amount'],
                'amount_usd' => (float) $validated['amount_usd'],
                'expires_at' => $order->expires_at->toIso8601String(),
            ]);
        } catch (\RuntimeException $e) {
            Log::error('Payment creation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment. Please try again later.',
            ], 500);
        }
    }
}
