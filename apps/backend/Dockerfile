FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

RUN apk add --no-cache curl bash
COPY . .

# Make startup script executable
RUN chmod +x start.sh

EXPOSE 3001

CMD ["./start.sh"]