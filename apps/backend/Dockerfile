FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

RUN apk add --no-cache curl
COPY . .

# The backend should handle migrations on startup if needed.

EXPOSE 3001

CMD ["node", "src/index.js"]