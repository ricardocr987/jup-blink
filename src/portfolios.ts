interface TokenMetric {
  weight: number;
  annual_return: number;
  annual_volatility: number;
  sharpe_ratio: number;
  symbol: string;
  address: string;
  chain: string;
}

export interface Portfolio {
  name: string;
  annual_returns: number;
  annual_volatility: number;
  sharpe_ratio: number;
  diversification_ratio: number;
  num_assets: number;
  token_metrics: Record<string, TokenMetric>;
}

interface PortfolioResponse {
  request_id: string;
  optimal_portfolios: Portfolio[];
}

const PORTFOLIO_DATA: PortfolioResponse = {
  "request_id": "1fb5d277-a948-40de-a99f-9fa748c07e30",
  "optimal_portfolios": [
    {
      "name": "balanced-portfolio",
      "annual_returns": 0.95,
      "annual_volatility": 0.45,
      "sharpe_ratio": 2.11,
      "diversification_ratio": 0.08,
      "num_assets": 5,
      "token_metrics": {
        "RNDR:4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R:solana": {
          "weight": 0.30,
          "annual_return": 1.15,
          "annual_volatility": 0.85,
          "sharpe_ratio": 1.35,
          "symbol": "RNDR",
          "address": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
          "chain": "solana"
        },
        "PYTH:6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN:solana": {
          "weight": 0.20,
          "annual_return": 0.95,
          "annual_volatility": 0.65,
          "sharpe_ratio": 1.46,
          "symbol": "PYTH",
          "address": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
          "chain": "solana"
        },
        "POPCAT:7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr:solana": {
          "weight": 0.15,
          "annual_return": 0.85,
          "annual_volatility": 0.55,
          "sharpe_ratio": 1.55,
          "symbol": "POPCAT",
          "address": "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
          "chain": "solana"
        },
        "JELLYJELLY:FeR8VBqNRSUD5NtXAj2n3j1dAHkZHfyDktKuLXD4pump:solana": {
          "weight": 0.15,
          "annual_return": 0.95,
          "annual_volatility": 0.70,
          "sharpe_ratio": 1.36,
          "symbol": "JELLYJELLY",
          "address": "FeR8VBqNRSUD5NtXAj2n3j1dAHkZHfyDktKuLXD4pump",
          "chain": "solana"
        },
      }
    },
    {
      "name": "grandpa-portfolio",
      "annual_returns": 0.87,
      "annual_volatility": 0.37,
      "sharpe_ratio": 2.29,
      "diversification_ratio": 0.02,
      "num_assets": 3,
      "token_metrics": {
        "JUP:JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN:solana": {
          "weight": 0.14,
          "annual_return": -0.11,
          "annual_volatility": 1.03,
          "sharpe_ratio": -0.13,
          "symbol": "JUP",
          "address": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          "chain": "solana"
        },
        "JLP:27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4:solana": {
          "weight": 0.83,
          "annual_return": 1.12,
          "annual_volatility": 0.26,
          "sharpe_ratio": 4.20,
          "symbol": "JLP",
          "address": "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4",
          "chain": "solana"
        },
        "JitoSOL:J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn:solana": {
          "weight": 0.03,
          "annual_return": 0.84,
          "annual_volatility": 0.78,
          "sharpe_ratio": 1.05,
          "symbol": "JitoSOL",
          "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
          "chain": "solana"
        }
      }
    },
    {
      "name": "degen-portfolio",
      "annual_returns": 1.2,
      "annual_volatility": 0.8,
      "sharpe_ratio": 1.5,
      "diversification_ratio": 0.05,
      "num_assets": 2,
      "token_metrics": {
        "BONK:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263:solana": {
          "weight": 0.6,
          "annual_return": 1.5,
          "annual_volatility": 1.2,
          "sharpe_ratio": 1.25,
          "symbol": "BONK",
          "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          "chain": "solana"
        },
        "JUP:JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN:solana": {
          "weight": 0.4,
          "annual_return": 0.9,
          "annual_volatility": 0.4,
          "sharpe_ratio": 2.25,
          "symbol": "JUP",
          "address": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          "chain": "solana"
        }
      }
    }
  ]
};

const PORTFOLIOS: Record<string, Portfolio> = Object.fromEntries(
  PORTFOLIO_DATA.optimal_portfolios.map(portfolio => [
    portfolio.name.toLowerCase().replace(/\s+/g, '-'),
    portfolio
  ])
);

export function getPortfolio(id: string): Portfolio | null {
  const portfolio = PORTFOLIOS[id];
  return portfolio || null;
} 