import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { buildTransaction } from "./solana/transaction/build/buildTransaction";
import { sendTransaction } from "./solana/transaction/send";
import { Address } from '@solana/addresses';
import { getPortfolio } from './portfolios';
import { staticPlugin } from '@elysiajs/static'
import { Action, ActionPostResponse, ActionError, ActionGetResponse } from '@solana/actions';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { getTokens } from './solana/fetcher/getTokens';
import BigNumber from 'bignumber.js';
import { getPrices } from './solana/fetcher/getPrices';
import { getMints, type DecodedMint } from './solana/fetcher/getMint';
import { SwapData } from './solana/transaction/types';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const ACTION_HEADERS: Record<string, string> = {
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  'Content-Type': 'application/json'
};

const message = 'Connect your wallet to swap tokens into a diversified portfolio';
function verifySignature(message: string, signature: string, account: string) {
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = bs58.decode(signature);
  const publicKeyBytes = bs58.decode(account);
  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    Uint8Array.from(publicKeyBytes),
  );
}

const app = new Elysia()
  .use(staticPlugin())
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

    if (request.method === 'OPTIONS') {
      set.status = 200;
      return new Response(null);
    }
  })
  .get("/actions.json", ({ set }) => {
    return {
      rules: [
        { pathPattern: '/*', apiPath: '/api/actions/*' },
        { pathPattern: '/api/actions/**', apiPath: '/api/actions/**' },
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
          image: new URL("/media/DTF.jpg", BASE_URL).toString(),
          url: BASE_URL
        },
        interstitialUrls: [
          "https://backpack.app",
          "https://phantom.app",
          "https://solflare.com"
        ]
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
  .get("/api/actions/portfolio-swap/:portfolioId", ({ params }) => {
    const signMessageAction = {
      type: 'action',
      label: 'Sign statement',
      icon: `${BASE_URL}/public/media/DTF.jpg`,
      title: 'Sign statement',
      description: 'This is sign statement',
      links: {
        actions: [
          {
            type: 'message',
            href: `/api/actions/portfolio-swap/${params.portfolioId}`,
            label: 'Connect Wallet',
          },
        ],
      },
    } satisfies Action;
    return signMessageAction;
  })
  .post("/api/actions/portfolio-swap/:portfolioId", ({ params }) => {
    const response = {
      type: 'message',
      data: message,
      links: {
        next: {
          type: 'post',
          href: `/api/actions/portfolio-swap/${params.portfolioId}/verify-signature`,
          label: 'Verify Signature',
        },
      },
    };

    return response;
  }, {
    detail: {
      tags: ['Actions'],
      description: 'Sign a message'
    }
  })
  .post("/api/actions/portfolio-swap/:portfolioId/verify-signature", async ({ body, params }) => {
    const { signature, account } = body;
    const { portfolioId } = params;

    if (!signature) {
      return {
        message: 'Signature is required',
      } satisfies ActionError;
    }

    const isSignatureValid = verifySignature(message, signature, account);
    
    if (!isSignatureValid) {
      return {
        type: 'action',
        title: 'Signature invalid',
        description: `Invalid message signature!
account = ${account}
message = ${message}
signature = ${signature}`,
        icon: `${BASE_URL}/public/media/DTF.jpg`,
        label: 'Invalid Signature'
      } satisfies Action;
    }

    try {
      const userTokens = await getTokens(account);
      const sortedTokens = userTokens
        .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
        .slice(0, 5);

      if (sortedTokens.length === 0) {
        return {
          type: 'action',
          icon: `${BASE_URL}/public/media/DTF.jpg`,
          title: 'No tokens found',
          description: 'No tokens with sufficient balance were found in your wallet',
          label: 'No Tokens'
        } satisfies Action;
      }

      const response: Action = {
        type: 'action',
        icon: `${BASE_URL}/public/media/DTF.jpg`,
        title: `Swap to Portfolio`,
        description: `Swap to Portfolio`,
        label: "Swap to Portfolio",
        links: {
          actions: [
            {
              type: "transaction",
              label: "Swap to Portfolio",
              href: `/api/actions/portfolio-swap/${portfolioId}/transaction`,
              parameters: [
                {
                  name: "inputToken",
                  label: "Select Token to Swap",
                  type: "select", 
                  required: true,
                  options: sortedTokens.map(token => ({
                    label: `${token.metadata.symbol} (${parseFloat(token.amount).toFixed(2)})`,
                    value: token.mint,
                    selected: token === sortedTokens[0]
                  })),
                },
                {
                  name: "amount",
                  label: "Amount to Swap",
                  type: "number",
                  required: true,
                },
                {
                  name: "slippageBps",
                  label: "Slippage Tolerance",
                  type: "select",
                  required: false,
                  options: [
                    { label: "0.1%", value: "10", selected: false },
                    { label: "0.5%", value: "50", selected: false },
                    { label: "1.0%", value: "100", selected: true },
                    { label: "2.0%", value: "200", selected: false }
                  ],
                }
              ]
            }
          ]
        }
      };

      return response;
    } catch (error) {
      console.error('Error fetching user tokens:', error);
      return {
        type: 'action',
        icon: `${BASE_URL}/public/media/DTF.jpg`,
        title: 'Error',
        description: 'Failed to fetch your token balances. Please try again.',
        label: 'Error'
      } satisfies Action;
    }
  }, {
    body: t.Object({
      signature: t.String({
        description: 'Base58 encoded signature',
        pattern: '^[1-9A-HJ-NP-Za-km-z]{87,88}$'
      }),
      account: t.String({
        description: 'Wallet address of the signer',
        pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$'
      }),
      state: t.Optional(t.Any())
    }),
    detail: {
      tags: ['Actions'],
      description: 'Verify a message signature',
      responses: {
        200: {
          description: 'Signature verification result'
        },
        400: {
          description: 'Invalid signature or account'
        }
      }
    }
  })
  .post(
    "/api/actions/portfolio-swap/:portfolioId/transaction",
    async ({ body, params }) => {
      try {
        const { account, data: { inputToken, amount, slippageBps = 100 } } = body;
        const { portfolioId } = params;
        const portfolio = getPortfolio(portfolioId);

        if (!portfolio) {
          return {
            error: {
              message: "Portfolio not found",
              code: "PORTFOLIO_NOT_FOUND"
            }
          };
        }

        if (!account) {
          return {
            error: {
              message: "Invalid wallet address"
            }
          };
        }

        // Get all token addresses including input token
        const tokenAddresses = [
          inputToken,
          ...Object.values(portfolio.token_metrics).map(t => t.address)
        ];

        // Fetch prices and mint info for all tokens
        const [prices, mints] = await Promise.all([
          getPrices(tokenAddresses),
          getMints(tokenAddresses)
        ]);

        const inputTokenPrice = prices[inputToken];
        const inputTokenMint = mints[inputToken];

        if (!inputTokenPrice || !inputTokenMint) {
          throw new Error(`Could not get price or mint info for input token ${inputToken}`);
        }

        // Calculate total input value in USD first
        const totalInputValue = new BigNumber(amount)
          .multipliedBy(inputTokenPrice)
          .decimalPlaces(6);

        const swaps = Object.values(portfolio.token_metrics)
          .map(token => {
            const outputTokenPrice = prices[token.address];
            const outputTokenMint = mints[token.address];

            if (!outputTokenPrice || !outputTokenMint) {
              console.warn(`Missing price or mint info for token ${token.address}, skipping swap`);
              return null;
            }

            // Calculate target value in USD for this token
            const targetValue = totalInputValue.multipliedBy(token.weight);
            
            // Calculate the input amount needed for this swap
            const inputAmount = new BigNumber(amount)
              .multipliedBy(token.weight)
              .multipliedBy(10 ** inputTokenMint.decimals)
              .decimalPlaces(0, BigNumber.ROUND_DOWN);

            if (inputAmount.isLessThanOrEqualTo(0)) {
              return null;
            }

            return {
              inputToken: inputToken as string,
              outputToken: token.address,
              amount: inputAmount.toNumber(),
              slippageBps: Number(slippageBps),
            };
          })
          .filter((swap): swap is SwapData => swap !== null);

        if (swaps.length === 0) {
          throw new Error("No valid swaps could be calculated");
        }

        const transactionData = {
          type: "swap" as const,
          signer: account as Address,
          swaps,
          slippageBps: Number(slippageBps),
        };

        const transaction = await buildTransaction(transactionData);

        const action: ActionPostResponse = {
          type: "transaction",
          transaction,
          message: `Swapping ${new BigNumber(amount).dividedBy(10 ** inputTokenMint.decimals).toString()} tokens to ${portfolio.name}: ${
            Object.values(portfolio.token_metrics)
              .map(({ symbol, weight }) => `${(weight * 100).toFixed(1)}% ${symbol}`)
              .join(", ")
          }`,
        };

        return action;
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
          description: 'Wallet address of the signer',
          pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$'
        }),
        data: t.Object({
          inputToken: t.String({
            description: 'Token address to swap from',
            pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$'
          }),
          amount: t.String({ 
            description: 'Amount of tokens to swap'
          }),
          slippageBps: t.Optional(t.String({ 
            description: 'Slippage tolerance in basis points',
            default: 100
          }))
        })
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
        }
      }
    }
  )
  .post(
    "/api/actions/portfolio-swap/:portfolioId/confirm",
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