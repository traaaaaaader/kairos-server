# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем workspace конфигурацию
COPY package*.json ./
COPY nest-cli.json tsconfig.json ./

# Копируем package.json всех зависимостей
COPY apps/core/package*.json ./apps/core/
COPY prisma/user/ ./prisma/user/

# Устанавливаем зависимости
RUN npm ci

# Генерируем Prisma Client
RUN npm run prisma:gen:user

# Копируем весь исходный код
COPY apps/core ./apps/core
COPY libs ./libs

# Собираем приложение для core
RUN npm run build core


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Устанавливаем curl для healthcheck
RUN apk add --no-cache curl

# Копируем package.json всех workspace проектов
COPY package*.json ./
COPY apps/core/package*.json ./apps/core/

# Устанавливаем production зависимости
RUN npm ci --omit=dev --ignore-scripts

# Копируем собранные файлы ТОЛЬКО core
COPY --from=builder /app/dist/apps/core ./dist

# Копируем Prisma схемы и сгенерированные клиенты
COPY --from=builder /app/prisma/user/schema.prisma ./prisma/user/
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/db-auth ./node_modules/@prisma/db-auth

CMD ["node", "dist/main.js"]
