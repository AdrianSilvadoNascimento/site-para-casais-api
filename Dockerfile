FROM node:18

WORKDIR /usr/src/app

# Limpa o cache do npm
RUN npm cache clean -f

COPY package*.json ./

# Remova a pasta node_modules, se existir
RUN rm -rf node_modules

# Reinstala as dependências
RUN npm install --legacy-peer-deps

# Reconstrói o módulo bcrypt
RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN npx prisma generate

EXPOSE 3004

CMD ["npm", "start"]
