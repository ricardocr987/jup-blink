# Jup-Blink: Solana Portfolio Swap API

A high-performance API service built with Bun and Elysia.js for executing portfolio-based token swaps on Solana using Solana Blinks. This service enables users to swap tokens into pre-configured, diversified portfolios with optimized allocations through shareable URLs that work anywhere on the internet.

## What are Solana Blinks?

Blinks are blockchain links that allow users to execute transactions directly from URLs. In our case, they enable portfolio swaps without requiring users to navigate to a specific dApp. Key features:

- Works directly from any platform that can display URLs (social media, chat, email)
- Fallback support for users without wallet extensions
- Secure transaction preview and signing process
- Compatible with major Solana wallets (Phantom, Backpack, Dialect)

## Features

- Portfolio-based token swaps on Solana via Blinks
- Pre-configured portfolios with optimized token allocations
- Wallet signature verification to get user address and then token balances to select
- Token price and mint information fetching
- Swagger API documentation
- CORS support
- Built with Bun for maximum performance

## Prerequisites

- [Bun](https://bun.sh) 1.2.0
- Docker (optional, for containerized deployment)
- Solana wallet extension (Phantom, Backpack, or Dialect) for testing with token balances

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

## Environment Variables: Checkout config.ts for more details

- `BASE_URL`: Base URL for the API (default: http://localhost:3000)
- `RPC_KEY`: Solana RPC key
- `BIRDEYE_API_KEY`: BirdEye API key
- `JUPITER_API_KEY`: Jupiter API key

## API Endpoints

- `GET api/actions/portfolio-swap/:id`: Get blink
- `POST api/actions/portfolio-swap/:id`: Execute blink

- Additional chainned endpoints triggered by the blink documented in Swagger

## Security

- Wallet signature verification for secure transactions
- CORS protection
- Action headers for version control
- Transaction simulation before execution
- Whitelisted domain verification

## Blink Security Considerations

- First-time wallet connections require user approval
- Transactions are always simulated before execution
- Blinks execute on different origins (social media, etc.) than their Action
- Users can opt-in to wallet support for Actions and Blinks
- Whitelisted domains are verified through the Dialect Actions Registry