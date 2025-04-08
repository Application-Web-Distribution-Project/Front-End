FROM node:14.17.0-alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies with specific settings
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy project files
COPY . .

# Configure environment
ENV NODE_OPTIONS=--max_old_space_size=4096

# Start development server with proper configuration
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--disable-host-check", "--poll", "2000", "--source-map=false", "--proxy-config", "proxy.conf.json"]
