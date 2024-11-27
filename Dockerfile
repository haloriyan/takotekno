FROM php:8.3

RUN apt-get update -y && apt-get install -y zip unzip git cron libzip-dev zlib1g-dev libpng-dev libjpeg-dev libfreetype6-dev clamav clamav-daemon libpq-dev
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY composer.phar /usr/local/bin/composer
RUN chmod +x /usr/local/bin/composer && composer --version

WORKDIR /var/www
COPY . /var/www

RUN docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ \
    && docker-php-ext-install gd \
    && docker-php-ext-install zip
RUN composer install --optimize-autoloader --no-dev

RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www
COPY --chown=www:www . /var/www

USER www

CMD bash -c "php artisan serve --host=0.0.0.0 --port=9000"
