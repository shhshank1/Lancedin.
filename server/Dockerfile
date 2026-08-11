# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy Prisma schema & generate Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to JavaScript in dist/
RUN npm run build

# ==========================================
# Stage 2: Runner
# ==========================================
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files, node_modules, compiled JS, and prisma schema
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose HTTP port
EXPOSE 3000

# Start server using production command (`node dist/index.js`)
CMD ["npm", "start"]
