FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json .npmrc* ./
RUN npm install --legacy-peer-deps

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build && test -f dist/main.js || (echo "ERROR: dist/main.js not produced by nest build" && exit 1)

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
