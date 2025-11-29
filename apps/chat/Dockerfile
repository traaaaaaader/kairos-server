# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Зависимости для mediasoup
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    gcc \
    pkgconfig \
    libc6-compat \
    bash \
    libtool \
    autoconf \
    automake \
    linux-headers

# Копируем workspace конфигурацию
COPY package*.json ./
COPY nest-cli.json tsconfig.json ./

# Копируем package.json всех зависимостей
COPY apps/chat/package*.json ./apps/chat/
COPY prisma/chat/ ./prisma/chat/

# Устанавливаем зависимости
RUN npm ci

# Генерируем Prisma Client
RUN npm run prisma:gen:chat

# Копируем весь исходный код
COPY apps/chat ./apps/chat
COPY libs ./libs

# Собираем приложение для chat
RUN npm run build chat


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Runtime зависимости для mediasoup
RUN apk add --no-cache \
    curl \
    libstdc++ \
    libc6-compat \
    bash

# Копируем package.json всех workspace проектов
COPY package*.json ./
COPY apps/chat/package*.json ./apps/chat/

# Устанавливаем production зависимости
RUN npm ci --omit=dev --ignore-scripts

# Копируем собранные файлы ТОЛЬКО chat
COPY --from=builder /app/dist/apps/chat ./dist

# Копируем Prisma схемы и сгенерированные клиенты
COPY --from=builder /app/prisma/chat/schema.prisma ./prisma/chat/
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/db-chat ./node_modules/@prisma/db-chat

# Копируем mediasoup worker
COPY --from=builder /app/node_modules/mediasoup ./node_modules/mediasoup

CMD ["node", "dist/main.js"]
