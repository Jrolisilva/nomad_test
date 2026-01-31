FROM node:20-alpine

WORKDIR /app

# Dependências
COPY package*.json ./
RUN npm install

# Código
COPY . .

# Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
