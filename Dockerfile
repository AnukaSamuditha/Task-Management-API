# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Dependencies Stage (Production only)
FROM node:22-alpine AS prod-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force


# Runtime Stage
FROM node:22-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodejs -G nodejs

ENV NODE_ENV=production
    
COPY --chown=nodejs:nodejs --from=prod-deps /app/node_modules ./node_modules

COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

USER nodejs

EXPOSE 5000

CMD ["node", "dist/app/index.js"]