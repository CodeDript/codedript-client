# Build stage
FROM node:22-alpine AS builder

# Accept build arguments
ARG VITE_THIRDWEB_CLIENT_ID
ARG VITE_AGREEMENT_CONTRACT
ARG VITE_API_BASE_URL

# Set as environment variables for Vite build
ENV VITE_THIRDWEB_CLIENT_ID=$VITE_THIRDWEB_CLIENT_ID
ENV VITE_AGREEMENT_CONTRACT=$VITE_AGREEMENT_CONTRACT
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
