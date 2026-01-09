FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Build argument (must be before first use)
ARG BUILD_ENV=staging

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code (including CSS files)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Copy environment file (using build arg)
COPY .env.${BUILD_ENV} ./.env.${BUILD_ENV}

# Build with environment (ensure CSS is generated)
RUN npm run build:${BUILD_ENV} || (echo "Build failed, checking logs..." && exit 1)

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npx", "next", "start"]