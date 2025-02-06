export const config = {
    HOST: process.env.HOST || "127.0.0.1",
    PORT: process.env.PORT || "3000",
    CORS_ORIGIN: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    RPC_ENDPOINT: process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
    HELIUS_API_KEY: process.env.HELIUS_API_KEY!,
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY!,
    JUPITER_API_KEY: process.env.JUPITER_API_KEY!,
    ALEXANDRIA_API_URL: process.env.ALEXANDRIA_API_URL || 'http://localhost:8000',
    ALEXANDRIA_API_KEY: process.env.ALEXANDRIA_API_KEY!,
    JUPITER_FEE_ACCOUNT: process.env.JUPITER_FEE_ACCOUNT!,
};
  
const requiredEnvVariables = [
    "RPC_ENDPOINT",
    "HELIUS_API_KEY",
    "BIRDEYE_API_KEY",
    "ALEXANDRIA_API_KEY",
    "JUPITER_FEE_ACCOUNT",
];
  
requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
});