# GalaxyMart NOWPayments LTC Integration — Production Deployment

## Overview

This Laravel 10 application integrates NOWPayments to accept Litecoin (LTC) payments on **galaxymart.store**. It uses **MongoDB Atlas** as the database.

## Prerequisites (Server)

- PHP 8.1+
- Composer
- [MongoDB PHP Extension](https://www.php.net/manual/en/mongodb.installation.php) (`php-mongodb`)
- Web server (Apache/Nginx) with URL rewriting
- HTTPS certificate (Let's Encrypt or your provider)
- MongoDB Atlas cluster (already configured)

## Step 1: Install MongoDB PHP Extension

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install php8.2-mongodb

# Verify
php -m | grep mongodb
```

## Step 2: Upload Files

Upload everything in `php-backend/` to your server (e.g., `/var/www/galaxymart.store/htdocs`).

Exclude these from upload (they're for local dev only):
- `Dockerfile`
- `docker-compose.yml`
- `start-dev.sh`
- `.dockerignore`
- `README-WINDOWS.md`

## Step 3: Install Dependencies

```bash
cd /var/www/galaxymart.store/htdocs
composer install --no-dev --optimize-autoloader
```

## Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Value |
|---|---|
| `APP_URL` | `https://galaxymart.store` |
| `APP_KEY` | Run `php artisan key:generate` to generate |
| `MONGODB_URI` | `mongodb+srv://in7lux:27am2006@clustermo.xxxxx.mongodb.net/galaxymart?retryWrites=true&w=majority` |
| `NOWPAYMENTS_API_KEY` | From NOWPayments dashboard |
| `NOWPAYMENTS_IPN_SECRET` | Must match IPN secret in NOWPayments dashboard |
| `MAIN_LTC_ADDRESS` | `ltc1qqdud5qkn8a0htncqadusude8kcndpkjgennr7f` |
| `BLOCKCYPHER_TOKEN` | Optional — get from https://blockcypher.com |
| `ADMIN_USERNAME` | Username for wallet dashboard |
| `ADMIN_PASSWORD` | Strong password for wallet dashboard |

## Step 5: Generate App Key & Clear Cache

```bash
php artisan key:generate
php artisan config:clear
php artisan cache:clear
```

## Step 6: Web Server Configuration

### Apache

Ensure `mod_rewrite` is enabled and your virtual host points to the `public/` directory:

```apache
<VirtualHost *:443>
    ServerName galaxymart.store
    DocumentRoot /var/www/galaxymart.store/htdocs/public

    <Directory /var/www/galaxymart.store/htdocs/public>
        AllowOverride All
        Require all granted
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

### Nginx

```nginx
server {
    listen 443 ssl;
    server_name galaxymart.store;

    root /var/www/galaxymart.store/htdocs/public;
    index index.php;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Step 7: Set Permissions

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## Step 8: Configure NOWPayments IPN

In your NOWPayments dashboard:

1. Go to **Settings → IPN Settings**
2. Set **IPN Callback URL**: `https://galaxymart.store/api/ipn`
3. Set **IPN Secret** to match `NOWPAYMENTS_IPN_SECRET` in your `.env`
4. Click **Save**

## Step 9: Verify Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `https://galaxymart.store/api/create-payment` | POST | Public | Creates a payment, returns LTC address |
| `https://galaxymart.store/api/ipn` | POST | Public | NOWPayments IPN callback |
| `https://galaxymart.store/api/wallet-balance` | GET | Public | Returns LTC balance JSON |
| `https://galaxymart.store/admin/wallet` | GET | Basic Auth | Admin wallet dashboard |

Quick test:

```bash
# Test wallet balance
curl https://galaxymart.store/api/wallet-balance

# Test payment creation
curl -X POST https://galaxymart.store/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Test Product","amount_usd":10.00}'

# Access admin dashboard (browser)
# Visit: https://galaxymart.store/admin/wallet
# Login with ADMIN_USERNAME / ADMIN_PASSWORD from .env
```

## Step 10: Test with a Real Payment

1. Use the `/api/create-payment` endpoint to generate a payment
2. Send the exact LTC amount to the returned address
3. Wait for network confirmation
4. Verify the IPN callback updates the order to "paid" in MongoDB
5. Check the admin dashboard for the updated status

## Files Overview

```
php-backend/
├── .env                        # Environment config (excluded from Git)
├── .env.example                # Template for .env
├── .gitignore
├── composer.json               # Dependencies
├── artisan
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── PaymentController.php  # POST /api/create-payment
│   │   │   ├── IpnController.php      # POST /api/ipn
│   │   │   └── WalletController.php   # GET /api/wallet-balance, /admin/wallet
│   │   └── Middleware/
│   │       ├── AdminAuth.php          # HTTP Basic Auth for admin
│   │       └── VerifyCsrfToken.php    # CSRF exemption for API routes
│   ├── Models/
│   │   └── Order.php                 # MongoDB Eloquent model
│   └── Services/
│       ├── NOWPaymentsService.php    # NOWPayments API wrapper
│       └── BlockCypherService.php    # LTC blockchain API wrapper
├── config/
│   ├── app.php                      # Admin auth config
│   ├── database.php                 # MongoDB connection
│   └── nowpayments.php              # Payment gateway config
├── database/                        # (empty — MongoDB is schemaless)
├── resources/views/
│   ├── admin/wallet.blade.php       # Wallet dashboard view
│   └── layouts/admin.blade.php      # Admin layout
├── routes/
│   ├── api.php                      # API routes
│   └── web.php                      # Web routes (admin)
└── public/
    └── index.php                    # Front controller
```

## Security Notes

1. **Regenerate secrets**: The API key and IPN secret in `.env` have been used in chat. Regenerate them in NOWPayments dashboard after testing.
2. **Never commit `.env`**: It's in `.gitignore` — keep it off version control.
3. **HTTPS required**: NOWPayments IPN requires HTTPS. Use Let's Encrypt for free SSL.
4. **IPN signature**: Every IPN callback is verified with HMAC-SHA512 using `hash_equals()` to prevent timing attacks.
5. **Admin dashboard**: Protected by HTTP Basic Auth. Set a strong `ADMIN_PASSWORD`.
6. **Rate limiting**: API routes are throttled (60 requests/minute by default).

## Troubleshooting

**MongoDB connection fails:**
- Check that `MONGODB_URI` in `.env` is correct
- Ensure your Atlas IP whitelist includes your server's IP (or use `0.0.0.0/0` for testing)
- Verify the MongoDB PHP extension is installed: `php -m | grep mongodb`

**IPN not received:**
- Check NOWPayments dashboard IPN logs
- Ensure HTTPS is working on your domain
- Verify the IPN secret matches between NOWPayments and `.env`
- Check Laravel logs: `storage/logs/laravel.log`

**Admin dashboard 401:**
- Ensure `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in `.env`
- Clear config cache: `php artisan config:clear`
- The browser will prompt for credentials via HTTP Basic Auth
