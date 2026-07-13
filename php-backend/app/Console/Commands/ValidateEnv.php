<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ValidateEnv extends Command
{
    protected $signature = 'env:validate';
    protected $description = 'Validate that all required environment variables are set';

    protected array $required = [
        'APP_KEY' => 'Application key (run php artisan key:generate if empty)',
        'APP_URL' => 'Application URL',
        'MONGODB_URI' => 'MongoDB Atlas connection string',
        'NOWPAYMENTS_API_KEY' => 'NOWPayments API key',
        'NOWPAYMENTS_IPN_SECRET' => 'NOWPayments IPN secret',
        'MAIN_LTC_ADDRESS' => 'Main LTC wallet address',
        'ADMIN_USERNAME' => 'Admin dashboard username',
        'ADMIN_PASSWORD' => 'Admin dashboard password',
    ];

    public function handle(): int
    {
        $missing = 0;

        $this->info('Validating environment variables...');

        foreach ($this->required as $key => $description) {
            $value = env($key);
            if (empty($value)) {
                $this->error("  ✗ {$key} is missing — {$description}");
                $missing++;
            } else {
                $safe = (str_contains($key, 'KEY') || str_contains($key, 'SECRET') || str_contains($key, 'PASSWORD'));
                $display = $safe ? substr($value, 0, 8) . '****' : $value;
                $this->line("  ✓ {$key}: {$display}");
            }
        }

        if ($missing > 0) {
            $this->warn("\n{$missing} required variable(s) missing. Update your .env file.");
            return Command::FAILURE;
        }

        $this->info("\n✅ All required environment variables are set.");
        return Command::SUCCESS;
    }
}
