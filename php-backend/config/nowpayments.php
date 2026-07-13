<?php

return [
    'api_key' => env('NOWPAYMENTS_API_KEY'),
    'api_url' => env('NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1'),
    'ipn_secret' => env('NOWPAYMENTS_IPN_SECRET'),
    'ltc_main_wallet' => env('MAIN_LTC_ADDRESS'),
    'blockcypher_token' => env('BLOCKCYPHER_TOKEN'),
];
