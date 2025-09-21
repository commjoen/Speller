# Use Node.js as base image
FROM node:24

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including serve)
RUN npm install --global npm@10.8.2 && npm ci

# Copy application files
COPY . .

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs speller

# Change ownership of the app directory
RUN chown -R speller:nodejs /app
USER speller

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/ || exit 1

# Start the application
CMD ["npm", "start"]