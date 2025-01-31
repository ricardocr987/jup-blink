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

const ALEXANDRIA_API_URL = process.env.ALEXANDRIA_API_URL || 'http://localhost:8000';

export async function getPortfolio(id: string): Promise<Portfolio | null> {
  try {
    // Split the ID into request_id and portfolio_name
    const [requestId, portfolioName] = id.split(':');
    if (!requestId || !portfolioName) {
      console.error('Invalid portfolio ID format. Expected format: request_id:portfolio_name');
      return null;
    }

    // Fetch portfolio data from alexandria API
    const response = await fetch(`${ALEXANDRIA_API_URL}/optimize/${requestId}/results`);
    if (!response.ok) {
      console.error('Failed to fetch portfolio data:', await response.text());
      return null;
    }

    const data: PortfolioResponse = await response.json();
    
    // Find the portfolio with matching name
    const portfolio = data.optimal_portfolios.find(p => 
      p.name.toLowerCase().replace(/\s+/g, '-') === portfolioName.toLowerCase()
    );

    return portfolio || null;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
} 