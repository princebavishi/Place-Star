# ─── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Build context = Backend/ directory (Railway sets root dir to "Backend")
COPY package.json package-lock.json ./

# Install production deps only
RUN npm ci --omit=dev

# ─── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

# Install tzdata + wget (for healthcheck)
RUN apk add --no-cache tzdata wget

ENV NODE_ENV=production \
    TZ=Asia/Kolkata

WORKDIR /app

# Copy deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY src ./src
COPY package.json ./

# Data directory for SQLite volume mount
RUN mkdir -p /data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "src/index.js"]
