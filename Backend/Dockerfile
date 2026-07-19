# ─── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only manifest files first to leverage Docker layer cache
COPY Backend/package.json Backend/package-lock.json ./

# Install production deps only
RUN npm ci --omit=dev

# ─── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

# Install tzdata so moment() reports correct local time and wget for healthcheck
RUN apk add --no-cache tzdata wget

ENV NODE_ENV=production \
    TZ=Asia/Kolkata

WORKDIR /app

# Copy deps from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY Backend/src ./src
COPY Backend/package.json ./

# Copy SQL seed file so init_db.js can initialise a fresh DB in production
COPY charusat_internship_portal.sql ./charusat_internship_portal.sql

# Data directory for SQLite volume mount
RUN mkdir -p /data && chown node:node /data

# Run as non-root user for security
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "src/index.js"]
