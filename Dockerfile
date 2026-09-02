FROM php:8.3-cli

# Install system packages & PHP extensions needed for Laravel & MySQL
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    && docker-php-ext-install pdo pdo_mysql mbstring

# Copy Composer binary from official Composer image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application files from CB_Sports_Server_Laravel folder
COPY CB_Sports_Server_Laravel/ .

# Ensure .env file is created from .env.example
RUN cp .env.example .env

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Ensure sqlite database file & storage permissions exist
RUN mkdir -p database storage bootstrap/cache && touch database/database.sqlite && chmod -R 777 database storage bootstrap/cache

EXPOSE 10000

# Run migrations, seeds safely, and start server
CMD touch database/database.sqlite && php artisan config:clear && php artisan config:cache && php artisan route:cache && (php artisan migrate --force || true) && (php artisan db:seed --force || true) && php artisan serve --host=0.0.0.0 --port=10000
