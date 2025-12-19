# Build stage
FROM node:22-alpine AS builder

# Accept build arguments
ARG VITE_THIRDWEB_CLIENT_ID
ARG VITE_AGREEMENT_CONTRACT
ARG VITE_API_BASE_URL

WORKDIR /app

COPY package*.json ./

RUN npm ci --prefer-offline --no-audit

ENV VITE_THIRDWEB_CLIENT_ID=$VITE_THIRDWEB_CLIENT_ID \
    VITE_AGREEMENT_CONTRACT=$VITE_AGREEMENT_CONTRACT \
    VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy source code
COPY . .


RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Optimized nginx config
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]