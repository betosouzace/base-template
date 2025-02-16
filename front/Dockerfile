# Estágio de desenvolvimento
FROM node:20-alpine AS development

# Instala o pnpm usando npm
RUN npm install -g pnpm@latest

WORKDIR /app

# Configura pnpm
RUN pnpm config set store-dir /tmp/pnpm-store

# Não precisamos copiar arquivos no estágio de desenvolvimento
# pois usaremos volumes para sincronização em tempo real

EXPOSE 3000

CMD ["sh", "-c", "pnpm install && pnpm run dev"]

# Estágio de build
FROM node:20-alpine AS builder

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

# Estágio de produção
FROM node:20-alpine AS production

RUN npm install -g pnpm@latest

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "start"] 