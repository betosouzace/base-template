#!/bin/sh

# Instala as dependências do Composer sem interação
composer install --no-interaction --no-progress

# Aguarda o banco de dados ficar disponível
echo "Aguardando banco de dados ficar disponível..."
while ! nc -z db 3306; do
  sleep 1
done
echo "Banco de dados está disponível!"

# Gera a chave da aplicação se não existir
php artisan key:generate --no-interaction --force

# Copia o arquivo .env de exemplo se não existir
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Executa as migrações e seeds
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction

# Inicia o servidor
php artisan serve --host 0.0.0.0 --port 8000

# Path: api/.docker/local/Dockerfile
