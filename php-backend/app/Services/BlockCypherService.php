<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BlockCypherService
{
    protected string $apiToken;

    public function __construct()
    {
        $this->apiToken = config('nowpayments.blockcypher_token');
    }

    /**
     * Get the current balance of a Litecoin address.
     *
     * Uses BlockCypher API: https://api.blockcypher.com/v1/ltc/main/addrs/{address}/balance
     *
     * @param string $address LTC wallet address
     * @return array{address: string, balance: float, unconfirmed_balance: float, total_received: float}
     */
    public function getBalance(string $address): array
    {
        $url = "https://api.blockcypher.com/v1/ltc/main/addrs/{$address}/balance";

        if ($this->apiToken) {
            $url .= "?token={$this->apiToken}";
        }

        $response = Http::get($url);

        if ($response->failed()) {
            Log::error('BlockCypher getBalance failed', [
                'address' => $address,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException(
                'Failed to fetch wallet balance: ' . ($response->json('error') ?? $response->body())
            );
        }

        $data = $response->json();

        return [
            'address' => $data['address'] ?? $address,
            'balance' => ($data['balance'] ?? 0) / 1e8,
            'unconfirmed_balance' => ($data['unconfirmed_balance'] ?? 0) / 1e8,
            'total_received' => ($data['total_received'] ?? 0) / 1e8,
        ];
    }

    /**
     * Get recent transactions for a Litecoin address.
     *
     * @param string $address LTC wallet address
     * @param int $limit Number of recent transactions
     * @return array
     */
    public function getTransactions(string $address, int $limit = 20): array
    {
        $url = "https://api.blockcypher.com/v1/ltc/main/addrs/{$address}";

        if ($this->apiToken) {
            $url .= "?token={$this->apiToken}";
        }

        $response = Http::get($url, [
            'limit' => $limit,
            'unspentOnly' => false,
            'includeScript' => false,
        ]);

        if ($response->failed()) {
            Log::error('BlockCypher getTransactions failed', [
                'address' => $address,
                'status' => $response->status(),
            ]);
            return [];
        }

        $data = $response->json();
        $txs = $data['txrefs'] ?? [];

        return array_map(function ($tx) use ($address) {
            $valueLtc = ($tx['value'] ?? 0) / 1e8;
            $isReceive = ($tx['tx_input_n'] ?? -1) < 0;

            return [
                'tx_hash' => $tx['tx_hash'] ?? '',
                'block_height' => $tx['block_height'] ?? 0,
                'confirmations' => $tx['confirmations'] ?? 0,
                'amount' => $valueLtc,
                'amount_usd' => 0,
                'type' => $isReceive ? 'receive' : 'send',
                'address' => $isReceive
                    ? ($tx['addresses'][0] ?? '')
                    : ($tx['addresses'][1] ?? ''),
                'confirmed_at' => $tx['confirmed'] ?? null,
                'double_spend' => $tx['double_spend'] ?? false,
            ];
        }, $txs);
    }
}
