# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем workspace конфигурацию
COPY package*.json ./
COPY nest-cli.json tsconfig.json ./

# Копируем package.json всех зависимостей
COPY apps/server/package*.json ./apps/server/
COPY prisma/server/ ./prisma/server/

# Устанавливаем зависимости
RUN npm ci

# Генерируем Prisma Client
RUN npm run prisma:gen:server

# Копируем весь исходный код
COPY apps/server ./apps/server
COPY libs ./libs

# Собираем приложение для server
RUN npm run build server


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Устанавливаем curl для healthcheck
RUN apk add --no-cache curl

# Копируем package.json всех workspace проектов
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

# Устанавливаем production зависимости
RUN npm ci --omit=dev --ignore-scripts

# Копируем собранные файлы ТОЛЬКО server
COPY --from=builder /app/dist/apps/server ./dist

# Копируем Prisma схемы и сгенерированные клиенты
COPY --from=builder /app/prisma/server/schema.prisma ./prisma/server/
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/db-server ./node_modules/@prisma/db-server

CMD ["node", "dist/main.js"]
