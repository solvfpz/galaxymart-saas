<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\NOWPaymentsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IpnController extends Controller
{
    public function __construct(
        protected NOWPaymentsService $nowpayments
    ) {}

    /**
     * POST /api/ipn
     *
     * Handles NOWPayments Instant Payment Notification callbacks.
     * Verifies HMAC-SHA512 signature.
     * Guards against duplicate processing: skips if order status is already 'paid' or 'failed'.
     */
    public function handleIpn(Request $request): JsonResponse
    {
        try {
            $rawBody = $request->getContent();
            $signature = $request->header('x-nowpayments-sig', '');

            if (!$this->nowpayments->verifyIpnSignature($rawBody, $signature)) {
                Log::warning('IPN signature verification failed', [
                    'ip' => $request->ip(),
                ]);
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            $data = json_decode($rawBody, true);

            if (!$data || !isset($data['payment_id'])) {
                Log::warning('IPN received invalid payload');
                return response()->json(['error' => 'Invalid payload'], 400);
            }

            $paymentId = $data['payment_id'];
            $paymentStatus = $data['payment_status'] ?? '';

            Log::info('IPN received', [
                'payment_id' => $paymentId,
                'status' => $paymentStatus,
                'order_id' => $data['order_id'] ?? 'N/A',
            ]);

            $order = Order::where('nowpayments_payment_id', $paymentId)->first();

            if (!$order) {
                Log::warning('IPN: Order not found', ['payment_id' => $paymentId]);
                return response()->json(['error' => 'Order not found'], 404);
            }

            // DUPLICATE IPN GUARD: Skip if already in a final state
            if (in_array($order->status, ['paid', 'delivered', 'failed', 'expired'])) {
                Log::info('IPN: Order already in final state, skipping', [
                    'order_id' => $order->order_id,
                    'current_status' => $order->status,
                    'ipn_status' => $paymentStatus,
                ]);
                return response()->json(['success' => true, 'skipped' => true]);
            }

            switch ($paymentStatus) {
                case 'finished':
                    $order->update([
                        'status' => 'paid',
                    ]);
                    Log::info("Order {$order->order_id} marked as paid.");
                    break;

                case 'failed':
                case 'expired':
                case 'refunded':
                    $order->update([
                        'status' => 'failed',
                        'notes' => "IPN: marked as {$paymentStatus}",
                    ]);
                    Log::info("Order {$order->order_id} marked as {$paymentStatus}.");
                    break;

                case 'waiting':
                case 'confirming':
                case 'confirmed':
                    Log::info("IPN: order {$order->order_id} still {$paymentStatus}, no status change.");
                    break;

                default:
                    Log::info("Unhandled IPN status '{$paymentStatus}'", [
                        'payment_id' => $paymentId,
                    ]);
            }

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            Log::error('IPN handler exception: ' . $e->getMessage());
            return response()->json(['error' => 'Internal error'], 500);
        }
    }
}
