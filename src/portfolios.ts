import ky from "ky";
import { config } from "./config";

interface TokenMetric {
  weight: number;
  investment_horizon_return: number;
  investment_horizon_volatility: number;
  score: number;
  score_type: 'sharpe';
  symbol: string;
  address: string;
  chain: string;
}

interface RiskMetrics {
  var_95: number;
  var_99: number;
  cvar_95: number;
  cvar_99: number;
  daily_volatility: number;
  skewness: number;
  kurtosis: number;
  tail_risk_ratio: number;
  max_drawdown: number;
  num_extreme_events: number;
  avg_days_between_extremes: number;
  worst_loss: number;
  top_5_worst_losses: number[];
  num_significant_drawdowns: number;
}

interface PlotPaths {
  portfolio_composition: string;
  correlation_heatmap: string;
  return_distribution: string;
  combined_returns_drawdown: string;
}

export interface PortfolioInfo {
  portfolio_metrics: {
    name: string;
    investment_horizon_returns: number;
    investment_horizon_volatility: number;
    score: number;
    score_type: 'sharpe';
    diversification_ratio: number;
    num_assets: number;
    token_metrics: Record<string, TokenMetric>;
  };
  risk_metrics: RiskMetrics;
  correlation_matrix: Record<string, Record<string, number>>;
  return_percentiles: Record<string, number>;
  monetary_impact: Record<string, number>;
  risk_warnings: string[];
  plot_paths: PlotPaths;
}

export interface Portfolio {
  request_id: string;
  investment_horizon: number;
  optimal_portfolios: PortfolioInfo[];
  efficient_portfolios: Array<PortfolioInfo['portfolio_metrics']>;
  efficient_frontier_plot: string;
  request_params?: {
    portfolio_size: number;
    risk_level: string;
    investment_horizon_days: number;
    chain: string;
    target_return: number;
    endpoint: string;
  };
}

export async function getPortfolio(requestId: string): Promise<Portfolio | null> {
  try {
    const response = await ky.get(`${config.ALEXANDRIA_API_URL}/optimize/results/${requestId}`, {
      headers: {
        'X-Service-API-Key': `${config.ALEXANDRIA_API_KEY}`,
      },
    });
    if (!response.ok) {
      console.error('Failed to fetch portfolio data:', await response.text());
      return null;
    }

    const data: Portfolio = await response.json();

    return data || null;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export function findPortfolioByName(portfolio: Portfolio, portfolioName: string): PortfolioInfo | null {
  const normalizedSearchName = decodeURIComponent(portfolioName).toLowerCase();
  const found = portfolio.optimal_portfolios.find(p => {
    const portfolioName = p.portfolio_metrics.name.toLowerCase();
    return portfolioName === normalizedSearchName || 
           portfolioName === normalizedSearchName.replace(/%20/g, ' ') ||
           portfolioName === normalizedSearchName.replace(/\s+/g, ' ');
  });

  return found || null;
}

export function getPortfolioImagePath(requestId: string, portfolioName: string): string {
  return `${config.ALEXANDRIA_API_URL}/plots/${requestId}/${portfolioName.toLowerCase()}_portfolio_composition.png`;
}