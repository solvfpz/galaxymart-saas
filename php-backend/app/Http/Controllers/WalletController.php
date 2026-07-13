<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\BlockCypherService;
use App\Services\NOWPaymentsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

class WalletController extends Controller
{
    public function __construct(
        protected BlockCypherService $blockCypher,
        protected NOWPaymentsService $nowpayments
    ) {}

    /**
     * GET /admin/wallet
     *
     * Renders the admin wallet dashboard view with balance, recent transactions,
     * NOWPayments history, and local orders from MongoDB.
     */
    public function index(): View
    {
        $mainAddress = config('nowpayments.ltc_main_wallet');
        $balanceData = [];
        $transactions = [];
        $payments = [];
        $recentOrders = [];
        $error = null;

        try {
            $balanceData = $this->blockCypher->getBalance($mainAddress);
            $transactions = $this->blockCypher->getTransactions($mainAddress);
            $payments = $this->nowpayments->getPaymentHistory(30);
            $recentOrders = Order::orderBy('created_at', 'desc')->limit(20)->get();
        } catch (\RuntimeException $e) {
            $error = $e->getMessage();
            Log::error('Wallet dashboard error: ' . $e->getMessage());
        }

        return view('admin.wallet', [
            'mainAddress' => $mainAddress,
            'balance' => $balanceData,
            'transactions' => $transactions,
            'payments' => $payments,
            'recentOrders' => $recentOrders,
            'error' => $error,
        ]);
    }

    /**
     * GET /api/wallet-balance
     *
     * Returns the current LTC wallet balance as JSON (for API clients).
     */
    public function getBalance(): JsonResponse
    {
        $mainAddress = config('nowpayments.ltc_main_wallet');

        try {
            $data = $this->blockCypher->getBalance($mainAddress);

            return response()->json([
                'success' => true,
                'address' => $data['address'],
                'balance_ltc' => $data['balance'],
                'unconfirmed_balance_ltc' => $data['unconfirmed_balance'],
                'total_received_ltc' => $data['total_received'],
            ]);
        } catch (\RuntimeException $e) {
            Log::error('Wallet balance fetch failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch wallet balance. Please try again later.',
            ], 502);
        }
    }
}
