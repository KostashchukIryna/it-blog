# Stage 1: Build
FROM node:20-alpine AS builder

# Приймаємо аргумент BACKEND_URL і робимо його доступним для збірки Next.js
ARG BACKEND_URL
ENV BACKEND_URL=${BACKEND_URL}

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]