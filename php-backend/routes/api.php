<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IpnController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Loaded within the "api" middleware group (CSRF disabled, throttled).
| All routes return JSON.
|
*/

// Payments
Route::post('/create-payment', [PaymentController::class, 'createPayment']);

// NOWPayments IPN webhook
Route::post('/ipn', [IpnController::class, 'handleIpn']);

// Wallet
Route::get('/wallet-balance', [WalletController::class, 'getBalance']);

// Dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

// Order management
Route::get('/orders/{orderId}', [OrderController::class, 'show']);
Route::post('/orders/{orderId}/status', [OrderController::class, 'updateStatus']);
