#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

PORT="${PORT:-10000}"

if [ -z "${APP_KEY:-}" ]; then
    echo "ERROR: APP_KEY is not configured in Render." >&2
    exit 1
fi

mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache

php artisan config:clear

echo "Running forward-only Laravel migrations..."
php artisan migrate --force

if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    echo "Running idempotent CuyoTech seeders..."
    php artisan db:seed --force
    php artisan db:seed --class=PortalExperienceSeeder --force
    php artisan db:seed --class=ProjectTeamSeeder --force
fi

echo "Listen ${PORT}" > /etc/apache2/ports.conf
sed "s/__PORT__/${PORT}/g" \
    /etc/apache2/sites-available/000-default.conf.template \
    > /etc/apache2/sites-available/000-default.conf

echo "Starting CuyoTech SSIS on 0.0.0.0:${PORT}"
exec apache2-foreground