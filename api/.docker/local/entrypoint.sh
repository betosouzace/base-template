#!/bin/sh

composer install --no-interaction --verbose

php artisan migrate

php artisan db:seed

php artisan serve --host 0.0.0.0 --port 8000

# Path: api/.docker/local/Dockerfile
