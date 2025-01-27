export interface Portfolio {
  id: string;
  name: string;
  description: string;
  allocation: {
    token: string;
    percentage: number;
  }[];
}

const PORTFOLIOS: Record<string, Portfolio> = {
  "defi-portfolio": {
    id: "defi-portfolio",
    name: "DeFi Portfolio",
    description: "A balanced portfolio of DeFi tokens",
    allocation: [
      { token: "So11111111111111111111111111111111111111112", percentage: 40 }, // SOL
      { token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", percentage: 40 }, // USDC
      { token: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", percentage: 20 }  // mSOL
    ]
  },
  "stable-portfolio": {
    id: "stable-portfolio",
    name: "Stable Portfolio",
    description: "A conservative portfolio focused on stability",
    allocation: [
      { token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", percentage: 80 }, // USDC
      { token: "So11111111111111111111111111111111111111112", percentage: 20 }  // SOL
    ]
  },
  "high-risk": {
    id: "high-risk",
    name: "High Risk Portfolio",
    description: "A high-risk, high-reward portfolio",
    allocation: [
      { token: "So11111111111111111111111111111111111111112", percentage: 50 }, // SOL
      { token: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", percentage: 50 }  // BONK
    ]
  }
};

export function getPortfolio(id: string): Portfolio | null {
  return PORTFOLIOS[id] || null;
} 