# stage 1
FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

# stage 2

FROM node:20-alpine

RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_CACHE_DIR=/cache/chrome/
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist


EXPOSE 3000

CMD ["sh", "-c", "npm run start"]