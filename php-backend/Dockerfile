FROM php:8.2-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    libxml2-dev \
    libonig-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install \
    mbstring \
    xml \
    zip \
    bcmath \
    curl

# MongoDB extension via pecl
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Working directory
WORKDIR /var/www/html

# Default entrypoint (will be overridden by docker-compose entrypoint)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
