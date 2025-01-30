# Jup-Blink: Solana Portfolio Swap API

A high-performance API service built with Bun and Elysia.js for executing portfolio-based token swaps on Solana. This service enables users to swap tokens into pre-configured, diversified portfolios with optimized allocations.

## Features

- Portfolio-based token swaps on Solana
- Pre-configured portfolios with optimized token allocations
- Wallet signature verification
- Token price and mint information fetching
- Swagger API documentation
- CORS support
- Built with Bun for maximum performance

## Prerequisites

- [Bun](https://bun.sh) 1.0.25 or higher
- Docker (optional, for containerized deployment)

## Installation

```bash
# Clone the repository
git clone [repository-url]
cd jup-blink

# Install dependencies
bun install
```

## Development

To start the development server with hot reload:
```bash
bun run dev
```

The API will be available at http://localhost:3000

## API Documentation

Once the server is running, you can access the Swagger documentation at:
http://localhost:3000/swagger

## Docker Deployment

Build the Docker image:
```bash
docker build -t jup-blink .
```

Run the container:
```bash
docker run -p 3000:3000 jup-blink
```

## Environment Variables

- `BASE_URL`: Base URL for the API (default: http://localhost:3000)
- Add other environment variables as needed for your deployment

## API Endpoints

- `GET /portfolio/:id`: Get portfolio information
- `POST /swap`: Execute a token swap into a portfolio
- `GET /tokens`: Get available tokens
- `GET /prices`: Get token prices
- Additional endpoints documented in Swagger

## Security

- Wallet signature verification for secure transactions
- CORS protection
- Action headers for version control