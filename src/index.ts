import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { buildTransaction } from "./solana/transaction/build/buildTransaction";
import { Address } from '@solana/addresses';
import { getPortfolio, findPortfolioByName, getPortfolioImagePath } from './portfolios';
import { staticPlugin } from '@elysiajs/static'
import { Action, ActionPostResponse, ActionError } from '@solana/actions';
import { getMainTokens } from './solana/fetcher/getTokens';
import BigNumber from 'bignumber.js';
import { getPrices } from './solana/fetcher/getPrices';
import { getMints } from './solana/fetcher/getMint';
import { SwapData } from './solana/transaction/types';
import { message, validateTokenAmount, verifySignature } from './validate';
import { sendTransaction } from './solana/transaction/send';
import { validateTransaction } from './solana/transaction/validate';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const ACTION_HEADERS: Record<string, string> = {
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  'Content-Type': 'application/json'
};

const app = new Elysia()
  .use(staticPlugin())
  .use(swagger({
    documentation: {
      info: {
        title: 'Portfolio Swap Blink API',
        version: '1.0.0',
        description: "Swap tokens into a diversified portfolio with a single click",
        contact: {
          name: "Franklin AI",
          url: "https://dtf.fun"
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
        description: "Swap tokens into a diversified portfolio with a single click",
        maintainer: {
          name: "Franklin AI",
          url: "https://dtf.fun"
        },
        openGraph: {
          title: "Portfolio Swap Blink",
          description: "Swap any token into a diversified portfolio with a single click",
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
  .get("/api/actions/portfolio-swap/:portfolioId", async ({ params }) => {
    const [requestId, portfolioName] = params.portfolioId.split(':');
    const portfolioResponse = await getPortfolio(requestId);
    
    if (!portfolioResponse) {
      return Response.json({
        message: 'The selected portfolio does not exist',
      }, { status: 404 });
    }

    const portfolio = findPortfolioByName(portfolioResponse, portfolioName);

    if (!portfolio) {
      return Response.json({
        message: 'The selected portfolio does not exist',
      }, { status: 404 });
    }

    const signMessageAction = {
      type: 'action',
      label: 'Connect wallet',
      icon: getPortfolioImagePath(requestId, portfolio.portfolio_metrics.name),
      title: 'Connect wallet',
      description: `Connect your wallet to swap tokens into ${portfolio.portfolio_metrics.name}`,
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
      const [requestId, portfolioName] = params.portfolioId.split(':');
      const portfolioResponse = await getPortfolio(requestId);
      if (!portfolioResponse) {
        return Response.json({
          message: 'The selected portfolio does not exist',
        }, { status: 404 });
      }

      const portfolio = findPortfolioByName(portfolioResponse, portfolioName);
      if (!portfolio) {
        return Response.json({
          message: 'The selected portfolio does not exist',
        }, { status: 404 });
      }

      const userTokens = await getMainTokens(account);
      const sortedTokens = userTokens
        .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
        .slice(0, 5);

      if (sortedTokens.length === 0) {
        return {
          type: 'action',
          icon: getPortfolioImagePath(requestId, portfolio.portfolio_metrics.name),
          title: 'Swap to Portfolio',
          description: 'Swap tokens into a diversified portfolio with a single click',
          label: 'Swap tokens into a diversified portfolio with a single click',
          error: {
            message: `No tokens with sufficient balance were found in your wallet`,
          },
        } satisfies Action;
      }

      const response: Action = {
        type: 'action',
        icon: getPortfolioImagePath(requestId, portfolio.portfolio_metrics.name),
        title: `Swap to Portfolio`,
        description: `Swap tokens into a diversified portfolio with a single click`,
        label: "Swap tokens into a diversified portfolio with a single click",
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
                    label: `${token.metadata.symbol} (Current balance: ${parseFloat(parseFloat(token.amount).toFixed(4)).toString()})`,
                    value: token.mint,
                    selected: token === sortedTokens[0]
                  })),
                },
                {
                  name: "amount",
                  label: "Amount to Swap",
                  type: "text",
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
        },
        error: {
          message: 'Failed to build transaction',
        }
      };

      return response;
    } catch (error) {
      console.error('Error fetching user tokens:', error);
      const [requestId, portfolioName] = params.portfolioId.split(':');
      const portfolioResponse = await getPortfolio(requestId);
      const portfolio = portfolioResponse ? findPortfolioByName(portfolioResponse, portfolioName) : null;
      return {
        type: 'action',
        icon: portfolio ? getPortfolioImagePath(requestId, portfolio.portfolio_metrics.name) : `${BASE_URL}/public/media/DTF.jpg`,
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
        const { account, data: { inputToken, amount: rawAmount, slippageBps = 100 } } = body;
        const amount = rawAmount.replace(',', '.');
        
        const [requestId, portfolioName] = params.portfolioId.split(':');
        const validation = await validateTokenAmount(account, inputToken, amount);
        if (!validation.isValid) {
          return Response.json(validation.error, { status: 501 });
        }

        const portfolioResponse = await getPortfolio(requestId);
        if (!portfolioResponse) {
          return Response.json({
            message: 'The selected portfolio does not exist',
          }, { status: 404 });
        }

        const portfolio = findPortfolioByName(portfolioResponse, portfolioName);
        if (!portfolio) {
          return Response.json({
            message: 'The selected portfolio does not exist',
          }, { status: 404 });
        }

        if (!account) {
          return {
            type: 'action',
            icon: getPortfolioImagePath(requestId, portfolio.portfolio_metrics.name),
            title: 'Invalid Wallet',
            description: 'Please connect your wallet and try again',
            label: 'Connect Wallet',
            error: {
              message: "Invalid wallet address"
            }
          } satisfies Action;
        }

        const tokenAddresses = [
          inputToken,
          ...Object.values(portfolio.portfolio_metrics.token_metrics).map(t => t.address)
        ];

        const [prices, mints] = await Promise.all([
          getPrices(tokenAddresses),
          getMints(tokenAddresses)
        ]);

        const inputTokenPrice = prices[inputToken];
        const inputTokenMint = mints[inputToken];

        if (!inputTokenPrice || !inputTokenMint) {
          throw new Error(`Could not get price or mint info for input token ${inputToken}`);
        }

        const swaps = Object.values(portfolio.portfolio_metrics.token_metrics)
          .map(token => {
            // Skip if input and output tokens are the same
            if (inputToken === token.address) {
              console.log(`Skipping swap for same token: ${token.symbol}`);
              return null;
            }

            const outputTokenPrice = prices[token.address];
            const outputTokenMint = mints[token.address];

            if (!outputTokenPrice || !outputTokenMint) {
              console.warn(`Missing price or mint info for token ${token.address}, skipping swap`);
              return null;
            }

            // Calculate the input amount needed for this swap based on portfolio weight
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
          throw new Error("No valid swaps could be calculated. This might happen if you're trying to swap to the same token or all swaps were filtered out.");
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
          message: `Swap completed successfully`
        };

        return action;
      } catch (error) {
        console.error('Error building transaction:', error);
        const [requestId, portfolioName] = params.portfolioId.split(':');
        const portfolioResponse = await getPortfolio(requestId);
        const portfolio = portfolioResponse ? findPortfolioByName(portfolioResponse, portfolioName) : null;
        return {
          type: 'action',
          icon: portfolio ? getPortfolioImagePath(requestId, portfolio.portfolio_metrics.name) : `${BASE_URL}/public/media/DTF.jpg`,
          title: 'Transaction Error',
          description: 'Failed to build the swap transaction. Please try again.',
          label: 'Try Again',
          error: {
            message: 'Failed to build transaction',
          }
        } satisfies Action;
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
    "/api/sendTransaction/:portfolioId",
    async ({ body, params }: { 
      body: { 
        transaction: string;
      },
      params: {
        portfolioId: string;
      } 
    }) => {
      try {
        const signature = await sendTransaction(body.transaction);

        /* To-do
        validateTransaction(
          txSignature,
          body.portfolioId
        ).catch(error => {
          console.error("Validation error:", error);
        });*/

        return { signature, status: 200 };
      } catch (error: any) {
        console.error("Error sending transaction:", error);
        return { signature: '', status: 500 };
      }
    },
    {
      body: t.Object({
        transaction: t.String(),
      }),
      params: t.Object({
        portfolioId: t.String()
      })
    }
  )
  .listen(3000);

console.log(`🦊 Portfolio Swap Blink is running at ${app.server?.hostname}:${app.server?.port}`);