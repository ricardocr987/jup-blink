# Use the official Bun image as base
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies with verbose logging for debugging
RUN bun install

# Copy the rest of the application
COPY . .

# Build the application (if needed)
# RUN bun run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"] 