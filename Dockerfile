FROM node:22-alpine AS frontend-build

WORKDIR /app

COPY FrontEndCuyoTechSSIS/package*.json ./
RUN npm ci

COPY FrontEndCuyoTechSSIS/ ./

# One-service deployment: React calls Laravel on the same origin.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build


FROM php:8.3-apache AS app

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libonig-dev \
        libzip-dev \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        mbstring \
        bcmath \
        opcache \
        zip \
    && a2enmod rewrite headers \
    && SECRET_GROUP="$(getent group 1000 | cut -d: -f1)" \
    && if [ -z "${SECRET_GROUP}" ]; then groupadd -g 1000 rendersecrets; SECRET_GROUP=rendersecrets; fi \
    && usermod -a -G "${SECRET_GROUP}" www-data \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY BackEndCuyoTechSSIS/ ./

RUN composer install \
        --no-dev \
        --prefer-dist \
        --no-interaction \
        --no-progress \
        --optimize-autoloader \
    && mkdir -p \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Preserve Laravel public/index.php and .htaccess, then add the React build.
COPY --from=frontend-build /app/dist/ /var/www/html/public/

COPY docker/apache-vhost.conf.template /etc/apache2/sites-available/000-default.conf.template
COPY docker/start-render.sh /usr/local/bin/start-render.sh

RUN sed -i 's/\r$//' /usr/local/bin/start-render.sh \
    && chmod +x /usr/local/bin/start-render.sh

EXPOSE 10000

ENTRYPOINT ["bash", "/usr/local/bin/start-render.sh"]