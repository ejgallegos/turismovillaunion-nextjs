# === Builder Stage ===
# Use a specific Node.js version for reproducibility
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies. This layer is cached
# to speed up future builds unless dependencies change.
COPY package.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
RUN npm run build

# === Runner Stage ===
# Use a minimal base image for the final container
FROM node:20-alpine AS runner

WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Copy only the necessary artifacts from the builder stage
# This keeps the final image size small
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app will run on (default for Next.js is 3000)
EXPOSE 3000

# The command to start the Next.js server in production mode
CMD ["npm", "start"]
