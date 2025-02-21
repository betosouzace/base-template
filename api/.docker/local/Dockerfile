# Use a imagem oficial do PHP 8.3 com Alpine Linux como base
FROM php:8.4.4-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Instala as dependências do PHP
RUN apk add --no-cache \
    libzip \
    openssl \
    curl \
    git \
    netcat-openbsd

RUN docker-php-ext-configure pdo_mysql
RUN docker-php-ext-install pdo pdo_mysql

ENV COMPOSER_ALLOW_SUPERUSER 1

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Diretorio de trabalho no container
VOLUME /app

# Define a porta que a aplicação irá escutar
EXPOSE 8000

# Define o comando que irá executar a aplicação
# CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "8000"]

# executa o entrypoint
COPY entrypoint.sh /root/entrypoint.sh
RUN ["chmod", "+x", "/root/entrypoint.sh"]
ENTRYPOINT /root/entrypoint.sh

# mantem o container em execução
# CMD ["tail", "-f", "/dev/null"]