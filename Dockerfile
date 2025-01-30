# Use the official Bun image as base
FROM oven/bun:1.0.25

# Set working directory
WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application (if needed)
# RUN bun run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"] 