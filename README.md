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
- Wallet signature verification
- Token price and mint information fetching
- Swagger API documentation
- CORS support
- Built with Bun for maximum performance

## Prerequisites

- [Bun](https://bun.sh) 1.0.25 or higher
- Docker (optional, for containerized deployment)
- Solana wallet extension (Phantom, Backpack, or Dialect) for testing

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

## Deployment to dial.to

The service already implements the Solana Actions specification with a built-in `/actions.json` endpoint that provides the following configuration:

```json
{
  "rules": [
    { "pathPattern": "/*", "apiPath": "/api/actions/*" },
    { "pathPattern": "/api/actions/**", "apiPath": "/api/actions/**" }
  ],
  "metadata": {
    "name": "Portfolio Swap Action",
    "version": "1.0.0",
    "description": "Swap tokens into a diversified portfolio with a single click",
    "maintainer": {
      "name": "Franklin AI",
      "url": "https://dtf.fun"
    },
    "openGraph": {
      "title": "Portfolio Swap Blink",
      "description": "Swap any token into a diversified portfolio with a single click",
      "image": "[BASE_URL]/media/DTF.jpg",
      "url": "[BASE_URL]"
    },
    "interstitialUrls": [
      "https://backpack.app",
      "https://phantom.app",
      "https://solflare.com"
    ]
  }
}
```

To deploy your Blink:

1. Deploy your API to your hosting platform of choice
2. Update your environment variables:
   ```bash
   BASE_URL=https://your-domain.com
   ```

3. Register your Action in the [Dialect Actions Registry](https://dialect.io)

4. Test your Blink:
   - Visit [dial.to](https://dial.to)
   - Input your Actions URL (e.g., `https://your-domain.com/api/actions/portfolio-swap/{portfolioId}`)
   - Preview how your Blink will appear across different platforms

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
- Transaction simulation before execution
- Whitelisted domain verification

## Blink Security Considerations

- First-time wallet connections require user approval
- Transactions are always simulated before execution
- Blinks execute on different origins (social media, etc.) than their Action
- Users can opt-in to wallet support for Actions and Blinks
- Whitelisted domains are verified through the Dialect Actions Registry