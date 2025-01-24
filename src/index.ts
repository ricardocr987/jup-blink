import { Elysia, t } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { buildTransaction } from "./solana/transaction/build/buildTransaction";
import { sendTransaction } from "./solana/transaction/send";
import { Address } from '@solana/addresses';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const ACTION_HEADERS: Record<string, string> = {
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  'Content-Type': 'application/json'
};

interface PortfolioSwapInfo {
  icon: string;
  title: string;
  description: string;
}

function getPortfolioSwapInfo(): PortfolioSwapInfo {
  return {
    icon: `${BASE_URL}/media/jupiter.png`,
    title: "Portfolio Token Swap",
    description: "Swap any token into a diversified portfolio"
  };
}

const SUPPORTED_TOKENS = [
  { label: "USDC", value: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  { label: "SOL", value: "So11111111111111111111111111111111111111112" },
  { label: "mSOL", value: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So" },
  { label: "BONK", value: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" }
] as const;

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Portfolio Swap Blink API',
        version: '1.0.0',
        description: 'API for swapping tokens into a diversified portfolio',
        contact: {
          name: 'Your Name',
          url: 'https://yourwebsite.com'
        }
      },
      tags: [
        { name: 'Actions', description: 'Action endpoints' },
        { name: 'Portfolio', description: 'Portfolio swap endpoints' }
      ]
    }
  }))
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept-Encoding',
      'Content-Encoding',
      'X-Action-Version',
      'X-Blockchain-Ids'
    ],
    maxAge: 3600,
    credentials: false
  }))
  .onRequest(({ request, set }) => {
    const path = new URL(request.url).pathname;
    if (path === '/actions.json' || path.startsWith('/api/actions/')) {
      const currentHeaders = set.headers || {};
      set.headers = {
        ...currentHeaders,
        ...ACTION_HEADERS
      };
    }
  })
  .get("/actions.json", ({ set }) => {
    return {
      rules: [
        { pathPattern: '/api/actions/**', apiPath: '/api/actions/**' }
      ],
      metadata: {
        name: "Portfolio Swap Action",
        version: "1.0.0",
        description: "Swap tokens into a diversified portfolio",
        maintainer: {
          name: "Your Name",
          url: "https://yourwebsite.com"
        },
        openGraph: {
          title: "Portfolio Swap Blink",
          description: "Swap any token into a diversified portfolio",
          image: `${BASE_URL}/media/jupiter.png`,
          url: BASE_URL
        }
      }
    };
  }, {
    detail: {
      tags: ['Actions'],
      description: 'Get action rules and metadata',
      responses: {
        200: {
          description: 'Action rules and metadata'
        }
      }
    }
  })
  .get("/api/actions/portfolio-swap", () => {
    const { icon, title, description } = getPortfolioSwapInfo();

    return {
      type: "action",
      icon,
      title,
      description,
      label: "Swap to Portfolio",
      links: {
        actions: [
          {
            type: "transaction",
            label: "Swap to Portfolio",
            href: "/api/actions/portfolio-swap",
            parameters: [
              {
                name: "inputToken",
                label: "Select Token to Swap",
                type: "select", 
                required: true,
                options: SUPPORTED_TOKENS,
                description: "Choose the token you want to swap from"
              },
              {
                name: "amount",
                label: "Amount to Swap",
                type: "number",
                required: true,
                minimum: 0,
                description: "Enter the amount of tokens to swap",
                placeholder: "0.00"
              },
              {
                name: "slippageBps",
                label: "Slippage Tolerance",
                type: "select",
                required: false,
                default: "100",
                options: [
                  { label: "0.1%", value: "10" },
                  { label: "0.5%", value: "50" },
                  { label: "1.0%", value: "100" },
                  { label: "2.0%", value: "200" }
                ],
                description: "Choose your maximum slippage tolerance"
              }
            ]
          }
        ],
      },
    };
  }, {
    detail: {
      tags: ['Portfolio'],
      description: 'Get portfolio swap action details',
      responses: {
        200: {
          description: 'Portfolio swap action details'
        }
      }
    }
  })
  .post(
    "/api/actions/portfolio-swap",
    async ({ body }) => {
      try {
        const { account, inputToken, amount, slippageBps = 100 } = body;
        
        if (!account) {
          return {
            error: {
              message: "Invalid wallet address"
            }
          };
        }

        const portfolio = [{ token: "SOL", percentage: 100 }];

        const transactionData = {
          type: "swap" as const,
          signer: account as Address,
          inputToken: inputToken as Address,
          outputToken: portfolio[0].token as Address,
          amount,
          slippageBps,
        };

        const transaction = await buildTransaction(transactionData);

        return {
          type: "transaction",
          transaction: transaction,
          message: `Swapping ${amount} tokens to portfolio: ${portfolio
            .map(({ token, percentage }) => `${percentage}% ${token}`)
            .join(", ")}`,
          links: {
            next: {
              type: "post",
              href: "/api/actions/portfolio-swap/confirm"
            }
          }
        };
      } catch (error) {
        return {
          error: {
            message: error instanceof Error ? error.message : "Failed to create swap transaction",
            code: "TRANSACTION_CREATION_FAILED"
          }
        };
      }
    },
    {
      body: t.Object({
        account: t.String({
          description: 'Wallet address of the user',
          pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$'
        }),
        inputToken: t.String({
          description: 'Token address to swap from'
        }),
        amount: t.Number({ 
          minimum: 0,
          description: 'Amount of tokens to swap'
        }),
        slippageBps: t.Optional(t.Number({ 
          minimum: 0, 
          maximum: 1000,
          description: 'Slippage tolerance in basis points'
        }))
      }),
      detail: {
        tags: ['Portfolio'],
        description: 'Create a portfolio swap transaction',
        responses: {
          200: {
            description: 'Transaction created successfully'
          },
          400: {
            description: 'Invalid request parameters'
          },
          401: {
            description: 'Invalid wallet address'
          }
        },
      }
    }
  )
  .post(
    "/api/actions/portfolio-swap/confirm",
    async ({ body }) => {
      try {
        if (!body.transaction) {
          return {
            error: {
              message: "No transaction provided",
              code: "INVALID_TRANSACTION"
            }
          };
        }

        const signature = await sendTransaction(body.transaction);
        
        return {
          type: "transaction",
          transaction: body.transaction,
          message: `Transaction confirmed with signature: ${signature}`,
          signature
        };
      } catch (error) {
        return {
          error: {
            message: error instanceof Error ? error.message : "Failed to confirm transaction",
            code: "TRANSACTION_CONFIRMATION_FAILED"
          }
        };
      }
    },
    {
      body: t.Object({
        transaction: t.String({
          description: 'Base64 encoded transaction to confirm'
        })
      }),
      detail: {
        tags: ['Portfolio'],
        description: 'Confirm and send a portfolio swap transaction',
        responses: {
          200: {
            description: 'Transaction confirmed successfully'
          },
          400: {
            description: 'Invalid transaction'
          }
        }
      }
    }
  )
  .listen(3000);

console.log(`🦊 Portfolio Swap Blink is running at ${app.server?.hostname}:${app.server?.port}`);