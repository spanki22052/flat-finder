# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies for native modules + OpenSSL (required by Prisma engine)
RUN apk add --no-cache python3 make g++ openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Install chromium and dependencies for rebrowser-playwright + OpenSSL (required by Prisma engine)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    openssl

# Set environment variables for Playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy necessary files from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 3001

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
