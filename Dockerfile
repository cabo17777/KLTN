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

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

EXPOSE 10000

# Run migrations, seeds, and start server
CMD php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=10000
