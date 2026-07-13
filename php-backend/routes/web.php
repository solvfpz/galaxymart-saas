<?php

use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::get('/admin/wallet', [WalletController::class, 'index'])
    ->middleware('admin.auth')
    ->name('admin.wallet');
