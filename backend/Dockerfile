# Node 20 on Debian — works with sharp prebuilt binaries for linux/amd64
FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
# Cloud Run sets PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/server.js"]
