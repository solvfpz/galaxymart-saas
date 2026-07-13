<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'order_id',
        'product_name',
        'amount_usd',
        'amount_ltc',
        'payment_address',
        'nowpayments_payment_id',
        'status',
        'tx_id',
        'expires_at',
        'delivered_at',
        'notes',
    ];

    protected $casts = [
        'amount_usd' => 'float',
        'amount_ltc' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'expires_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }
}
