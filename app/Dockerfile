# Stage 1: Build the application
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set build-time environment variables if any
# ARG NEXT_PUBLIC_...
# ENV NEXT_PUBLIC_...

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-slim AS runner

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy the standalone Next.js server output
COPY --from=builder /app/.next/standalone ./

# Copy the data files needed by the services
COPY --from=builder /app/src/data ./src/data

# Copy the public and .next/static folders
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
