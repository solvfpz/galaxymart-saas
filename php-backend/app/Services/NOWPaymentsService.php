<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NOWPaymentsService
{
    protected string $apiKey;
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('nowpayments.api_key');
        $this->apiUrl = config('nowpayments.api_url');
    }

    /**
     * Create a payment and get a unique LTC address for the order.
     *
     * @param float $amountUSD  Amount in USD
     * @param string $orderId   Your internal order ID
     * @param string $orderDescription Description for the order
     * @return array{payment_id: string, pay_address: string, pay_amount: float, pay_currency: string}
     */
    public function createPayment(float $amountUSD, string $orderId, string $orderDescription = ''): array
    {
        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->apiUrl}/payment", [
            'price_amount' => $amountUSD,
            'price_currency' => 'usd',
            'pay_currency' => 'ltc',
            'order_id' => $orderId,
            'order_description' => $orderDescription ?: "Order #{$orderId}",
            'ipn_callback_url' => url('/api/ipn'),
            'is_fixed_rate' => false,
            'is_fee_paid_by_user' => true,
        ]);

        if ($response->failed()) {
            Log::error('NOWPayments createPayment failed', [
                'order_id' => $orderId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException(
                'Payment creation failed: ' . ($response->json('message') ?? $response->body())
            );
        }

        $data = $response->json();

        return [
            'payment_id' => $data['payment_id'] ?? '',
            'pay_address' => $data['pay_address'] ?? '',
            'pay_amount' => $data['pay_amount'] ?? 0,
            'pay_currency' => $data['pay_currency'] ?? 'LTC',
        ];
    }

    /**
     * Get payment status from NOWPayments.
     */
    public function getPaymentStatus(string $paymentId): array
    {
        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
        ])->get("{$this->apiUrl}/payment/{$paymentId}");

        if ($response->failed()) {
            Log::error('NOWPayments getPaymentStatus failed', [
                'payment_id' => $paymentId,
                'status' => $response->status(),
            ]);
            throw new \RuntimeException('Failed to fetch payment status.');
        }

        return $response->json();
    }

    /**
     * Get payment history (for wallet dashboard).
     *
     * @param int $limit Number of recent payments to fetch
     */
    public function getPaymentHistory(int $limit = 50): array
    {
        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
        ])->get("{$this->apiUrl}/payment", [
            'limit' => $limit,
            'sort_by' => 'created_at',
            'order_by' => 'desc',
        ]);

        if ($response->failed()) {
            Log::error('NOWPayments getPaymentHistory failed', [
                'status' => $response->status(),
            ]);
            return [];
        }

        return $response->json()['data'] ?? [];
    }

    /**
     * Verify IPN signature.
     *
     * NOWPayments sends an x-nowpayments-sig header.
     * The signature is HMAC-SHA512 of the raw POST body, keyed by your IPN secret.
     *
     * @param string $rawBody  Raw request body as string
     * @param string $signature The signature from x-nowpayments-sig header
     * @return bool
     */
    public function verifyIpnSignature(string $rawBody, string $signature): bool
    {
        $ipnSecret = config('nowpayments.ipn_secret');

        if (empty($ipnSecret)) {
            Log::warning('IPN secret is not configured. Signature verification skipped.');
            return false;
        }

        $expectedSignature = hash_hmac('sha512', $rawBody, $ipnSecret);

        return hash_equals($expectedSignature, $signature);
    }
}
