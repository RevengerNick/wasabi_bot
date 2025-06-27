# wasabi_bot/frontend/Dockerfile

# --- СТАДИЯ СБОРКИ ---
FROM --platform=linux/arm64/v8 node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Собираем статические файлы
RUN npm run build

# --- СТАДИЯ РАЗДАЧИ ---
FROM --platform=linux/arm64/v8 nginx:alpine

# Копируем только собранные файлы из стадии "builder"
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем нашу конфигурацию Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
