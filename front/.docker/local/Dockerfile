# Use a Node.js imagem como base
FROM node:20.14.0-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# diretório de trabalho no container
VOLUME /app

# Define a porta que a aplicação irá escutar
EXPOSE 3000

# Execute o comando para iniciar a aplicação
# CMD ["npm", "run", "dev"]

# instala e configura o pnpm
RUN npm install -g pnpm

# executa o entrypoint
COPY entrypoint.sh /root/entrypoint.sh
RUN ["chmod", "+x", "/root/entrypoint.sh"]
ENTRYPOINT /root/entrypoint.sh

# mantem o container em execução
# CMD ["tail", "-f", "/dev/null"]