FROM node:14.17.0-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Create specific directory for jspdf-polyfill.js
RUN mkdir -p /app/dist/Slices/

# Use Nginx to serve the application
FROM nginx:alpine

# Copy custom nginx config to serve Angular properly
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular app from the builder stage
COPY --from=builder /app/dist/Slices /usr/share/nginx/html/

# Copy jspdf-polyfill.js to nginx html directory
COPY ./src/jspdf-polyfill.js /usr/share/nginx/html/

# Expose port 4200
EXPOSE 4200

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
