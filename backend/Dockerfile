# wasabi_bot/backend/Dockerfile

# Используем базовый образ Node.js для ARM64
FROM --platform=linux/arm64/v8 node:20-alpine AS base

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate
RUN npm run build
# Запускаем миграции при старте
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]