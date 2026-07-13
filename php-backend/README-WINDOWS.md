# GalaxyMart NOWPayments — Windows Development Setup

Run this Laravel 10 project on **Windows 10/11** for local development with ngrok.

## Option A: Docker (Recommended)

### Prerequisites

- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) (with WSL2 backend)
- [ngrok](https://ngrok.com/download) (free account)

### Setup

```powershell
# 1. Open PowerShell in the php-backend directory
cd C:\Users\manas\Downloads\galaxymart-saas-main\galaxymart-saas-main\php-backend

# 2. Build and start the container
docker-compose up -d --build

# 3. Wait ~30s for first build, then check logs
docker-compose logs -f
# You should see: "GalaxyMart Payments — Laravel Dev Server"
# Press Ctrl+C to stop following logs

# 4. Open your browser
start http://localhost:8000

# 5. Test the wallet balance API
curl http://localhost:8000/api/wallet-balance
```

### ngrok (Expose local server to the internet)

```powershell
# In a new terminal, run:
ngrok http http://localhost:8000

# Copy the generated ngrok URL, e.g.: https://abc123.ngrok-free.dev
# Set this URL as APP_URL in .env:
#   APP_URL=https://abc123.ngrok-free.dev
# Then restart the container:
docker-compose restart

# Set the same URL in NOWPayments Dashboard → IPN Settings:
#   https://abc123.ngrok-free.dev/api/ipn
```

### Test IPN Webhook

```powershell
# Simulate a NOWPayments IPN callback:
curl -X POST https://abc123.ngrok-free.dev/api/ipn ^
  -H "Content-Type: application/json" ^
  -d "{\"payment_id\":\"test123\",\"payment_status\":\"finished\",\"order_id\":\"ORDER001\"}"

# Expected: {"error":"Invalid signature"} — signature will fail since it's a test,
# but that proves the endpoint is reachable.
```

### Useful Commands

```powershell
# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after Dockerfile changes
docker-compose up -d --build

# Run artisan commands
docker-compose exec app php artisan tinker
```

### Environment Variables

Edit `.env` on your host machine — it's mounted into the container and changes take effect after `docker-compose restart`.

| Variable | Description |
|---|---|
| `APP_URL` | Set to your ngrok URL for IPN callbacks |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NOWPAYMENTS_API_KEY` | From NOWPayments dashboard |
| `NOWPAYMENTS_IPN_SECRET` | Must match IPN secret in NOWPayments dashboard |
| `LTC_MAIN_WALLET` | Your main LTC payout wallet address |
| `BLOCKCYPHER_API_TOKEN` | From BlockCypher free tier |

---

## Option B: Laragon (Simpler, No Docker)

### Prerequisites

- [Laragon](https://laragon.org/download/) (Full edition — includes PHP 8.x, Composer, Nginx/Apache, MySQL)

### Setup

```powershell
# 1. Install Laragon (run the installer, default settings are fine)

# 2. Start Laragon → Menu → PHP → Version → 8.2.x (or latest 8.x)

# 3. Open Laragon's terminal: Menu → Terminal

# 4. In the Laragon terminal:
cd C:/Users/manas/Downloads/galaxymart-saas-main/galaxymart-saas-main/php-backend

# 5. Install dependencies
composer install

# 6. Generate app key
php artisan key:generate

# 7. Clear config
php artisan config:clear

# 8. Start dev server
php artisan serve --host=0.0.0.0 --port=8000
```

### Verify

Open `http://localhost:8000` in your browser.

### ngrok

```powershell
# In a separate terminal (outside Laragon):
ngrok http http://localhost:8000
```

Update `APP_URL` in `.env` to your ngrok URL, then restart `php artisan serve`.

---

## Option C: Manual PHP + Composer (No Docker, No Laragon)

### Prerequisites

- Windows 10/11 (64-bit)

### Steps

```powershell
# 1. Install PHP 8.2
# Download from: https://windows.php.net/downloads/releases/php-8.2.13-Win32-vs16-x64.zip
# Extract to C:\php

# 2. Add PHP to PATH
[Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\php", "User")

# 3. Enable extensions: edit C:\php\php.ini
# Uncomment: extension=mbstring, extension=curl, extension=zip, extension=openssl, extension=fileinfo
# Add: extension=php_mongodb.dll (download from https://pecl.php.net/package/mongodb)

# 4. Install Composer
# Download and run: https://getcomposer.org/Composer-Setup.exe

# 5. Navigate to project and install
cd C:\Users\manas\Downloads\galaxymart-saas-main\galaxymart-saas-main\php-backend
composer install
php artisan key:generate
php artisan config:clear
php artisan serve --host=0.0.0.0 --port=8000

# 6. Expose with ngrok
ngrok http http://localhost:8000
```

---

## Testing Checklist

After setup, verify everything works:

- [ ] `http://localhost:8000` loads (may show 404 — that's OK, there's no root route)
- [ ] `http://localhost:8000/api/wallet-balance` returns JSON (may error if MongoDB URI isn't valid yet)
- [ ] `http://localhost:8000/api/create-payment` returns 405 for GET (correct — needs POST)
- [ ] `http://localhost:8000/api/ipn` returns 405 for GET (correct — needs POST)
- [ ] ngrok exposes `http://localhost:8000` to the internet
- [ ] NOWPayments dashboard IPN URL is set to `https://your-ngrok-url.ngrok-free.dev/api/ipn`
- [ ] POST to `https://your-ngrok-url.ngrok-free.dev/api/ipn` returns JSON (signature errors are expected without valid signature header)

### Test Payment Flow

```powershell
curl -X POST http://localhost:8000/api/create-payment ^
  -H "Content-Type: application/json" ^
  -d '{"product_name":"Test Product","amount_usd":10.00}'
```

Expected:
```json
{
  "success": true,
  "order_id": "ABC123XYZ789",
  "payment_address": "ltc1q...",
  "amount_ltc": 0.xxx,
  "amount_usd": 10.00
}
```

---

## Files Added

| File | Purpose |
|---|---|
| `Dockerfile` | PHP 8.2 + MongoDB extension + Composer |
| `docker-compose.yml` | Single-container dev server on port 8000 |
| `start-dev.sh` | Entrypoint: auto-installs deps, generates key, starts server |
| `.dockerignore` | Excludes vendor, .env, logs from Docker build context |
| `README-WINDOWS.md` | This file |

## Troubleshooting

**Docker build fails with "pecl install mongodb" error:**
```powershell
# Ensure Docker Desktop has WSL2 integration enabled
# Or try:
docker-compose build --no-cache
```

**Container starts but "Connection refused" on localhost:8000:**
```powershell
docker-compose logs -f
# Check if artisan serve started successfully
```

**MongoDB connection fails:**
- Verify `MONGODB_URI` in `.env` is correct
- Ensure your MongoDB Atlas IP whitelist allows connections (add `0.0.0.0/0` for testing, then lock down later)

**ngrok URL not working:**
```powershell
ngrok http http://localhost:8000 --host-header=localhost:8000
```
