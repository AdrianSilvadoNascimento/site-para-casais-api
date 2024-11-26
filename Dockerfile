FROM node:20

WORKDIR /usr/src/app

# Limpa o cache do npm
RUN npm cache clean -f

# Copia apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Remove a pasta node_modules, se existir, e instala as dependências
RUN rm -rf node_modules
RUN npm install --legacy-peer-deps

# Reconstrói o módulo bcrypt, se necessário
RUN npm rebuild bcrypt --build-from-source

# Copia o restante dos arquivos do projeto para o container
COPY . .

# Gera os arquivos do Prisma (se necessário)
RUN npx prisma generate

# Compila a aplicação NestJS
RUN npm run build

# Expõe a porta da aplicação
EXPOSE 10000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
