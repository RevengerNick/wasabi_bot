# wasabi_bot/bot/Dockerfile
FROM --platform=linux/arm64/v8 node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "bot.js"]