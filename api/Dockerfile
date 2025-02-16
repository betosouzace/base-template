FROM php:8.2-fpm

# Argumentos definidos no docker-compose.yml
ARG user
ARG uid

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-configure gd \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip

# Limpa cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Obtém última versão do Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Cria usuário do sistema
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Define diretório de trabalho
WORKDIR /var/www

# Copia arquivos do projeto
COPY . /var/www

# Define permissões
RUN chown -R $user:$user /var/www

USER $user

# Expõe porta 9000
EXPOSE 9000

CMD ["php-fpm"] 