#!/bin/sh
set -e

cd /var/www/html

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
    echo "[setup] Creating .env from .env.example..."
    cp .env.example .env
fi

# Install Composer dependencies if vendor is missing
if [ ! -d vendor ]; then
    echo "[setup] Running composer install..."
    composer install --no-interaction
fi

# Generate app key if not set
APP_KEY=$(grep -o '^APP_KEY=.*' .env | cut -d= -f2)
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "[setup] Generating app key..."
    php artisan key:generate --force
fi

# Clear config cache
echo "[setup] Clearing config cache..."
php artisan config:clear

# Start dev server
echo "-----------------------------------------------------------"
echo "  GalaxyMart Payments â€” Laravel Dev Server"
echo "  Local:   http://localhost:8000"
echo "  Expose via ngrok:  ngrok http http://localhost:8000"
echo "-----------------------------------------------------------"
php artisan serve --host=0.0.0.0 --port=8000
