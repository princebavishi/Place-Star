# ─── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests first to leverage layer cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build args — Railway/CI passes the full backend URL at build time
# VITE_API_URL = full URL e.g. https://placestar-backend.up.railway.app
# Falls back to http://localhost:3000 for local docker-compose
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=${VITE_API_URL}

# Build static assets
RUN npm run build

# ─── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy React build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx:alpine has wget available via busybox
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
