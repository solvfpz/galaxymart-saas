@extends('layouts.admin')

@section('title', 'Wallet Dashboard')

@section('content')
<div class="grid-2">
    <div class="card">
        <h2>Wallet Balance</h2>
        @if($error)
            <div class="error-box">
                <strong>Error fetching blockchain data:</strong> {{ $error }}
                <p style="margin-top:0.5rem;font-size:0.875rem;">
                    Check your LTC address and BlockCypher API token in <code>.env</code>.
                </p>
            </div>
        @endif

        <div class="stat">
            <div class="stat-value">
                {{ number_format($balance['balance'] ?? 0, 8) }}
            </div>
            <div class="stat-label">LTC (Confirmed Balance)</div>
        </div>
        <div style="margin-top:1rem;font-size:0.875rem;">
            <p><strong>Unconfirmed:</strong> {{ number_format($balance['unconfirmed_balance'] ?? 0, 8) }} LTC</p>
            <p><strong>Total Received:</strong> {{ number_format($balance['total_received'] ?? 0, 8) }} LTC</p>
            <p style="margin-top:0.5rem;"><strong>Address:</strong></p>
            <p class="address">{{ $mainAddress }}</p>
        </div>
    </div>

    <div class="card">
        <h2>Recent Blockchain Transactions</h2>
        @if(empty($transactions))
            <div class="loading">No recent transactions found.</div>
        @else
            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount (LTC)</th>
                            <th>Confirmations</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach(array_slice($transactions, 0, 15) as $tx)
                        <tr>
                            <td>
                                <span class="badge {{ $tx['type'] === 'receive' ? 'badge-success' : 'badge-danger' }}">
                                    {{ ucfirst($tx['type']) }}
                                </span>
                            </td>
                            <td class="{{ $tx['type'] === 'receive' ? 'amount-positive' : 'amount-negative' }}">
                                {{ $tx['type'] === 'receive' ? '+' : '-' }}{{ number_format($tx['amount'], 8) }}
                            </td>
                            <td>{{ $tx['confirmations'] }}</td>
                            <td>{{ $tx['confirmed_at'] ? \Carbon\Carbon::parse($tx['confirmed_at'])->format('Y-m-d H:i') : 'Pending' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</div>

<div class="grid-2">
    <div class="card">
        <h2>Local Orders (MongoDB)</h2>
        @if($recentOrders->isEmpty())
            <div class="loading">No orders found in the database.</div>
        @else
            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>USD</th>
                            <th>LTC</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($recentOrders as $o)
                        <tr>
                            <td class="address">{{ $o->order_id }}</td>
                            <td>{{ $o->product_name }}</td>
                            <td>${{ number_format($o->amount_usd, 2) }}</td>
                            <td>{{ number_format($o->amount_ltc, 8) }}</td>
                            <td>
                                <span class="badge {{ $o->status === 'paid' ? 'badge-success' : ($o->status === 'pending' ? 'badge-pending' : 'badge-danger') }}">
                                    {{ $o->status }}
                                </span>
                            </td>
                            <td>{{ $o->created_at ? \Carbon\Carbon::parse($o->created_at)->format('Y-m-d H:i') : 'N/A' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>

    <div class="card">
        <h2>NOWPayments History</h2>
        @if(empty($payments))
            <div class="loading">No payments found in NOWPayments history.</div>
        @else
            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>Order ID</th>
                            <th>Amount (LTC)</th>
                            <th>Amount (USD)</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach(array_slice($payments, 0, 20) as $p)
                        <tr>
                            <td class="address">{{ $p['payment_id'] ?? 'N/A' }}</td>
                            <td>{{ $p['order_id'] ?? 'N/A' }}</td>
                            <td>{{ number_format($p['pay_amount'] ?? 0, 8) }}</td>
                            <td>${{ number_format($p['price_amount'] ?? 0, 2) }}</td>
                            <td>
                                <span class="badge {{ ($p['payment_status'] ?? '') === 'finished' ? 'badge-success' : (in_array($p['payment_status'] ?? '', ['failed','expired']) ? 'badge-danger' : 'badge-pending') }}">
                                    {{ $p['payment_status'] ?? 'unknown' }}
                                </span>
                            </td>
                            <td>{{ isset($p['created_at']) ? \Carbon\Carbon::parse($p['created_at'])->format('Y-m-d H:i') : 'N/A' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</div>
@endsection
