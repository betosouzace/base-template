#!/bin/sh

# Instala as dependências sem interação
pnpm install --no-interactive

# Aguarda o serviço da API estar disponível
echo "Aguardando API ficar disponível..."
while ! nc -z api 8000; do
  sleep 1
done
echo "API está disponível!"

# Inicia o servidor de desenvolvimento
pnpm run dev

# Path: front/.docker/local/Dockerfile