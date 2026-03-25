# stage 1
FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

# stage 2

FROM node:20-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
ENV PUPPETEER_CACHE_DIR=/app/chrome

RUN apt-get update && apt-get install -y chromium

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist


EXPOSE 3000

CMD ["sh", "-c", "npm run start"]