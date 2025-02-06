export const config = {
    HOST: process.env.HOST || "127.0.0.1",
    PORT: process.env.PORT || "3000",
    CORS_ORIGIN: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    RPC_KEY: process.env.RPC_KEY,
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
    JUPITER_API_KEY: process.env.JUPITER_API_KEY,
};
  
const requiredEnvVariables = [
    "RPC_KEY",
    "BIRDEYE_API_KEY",
];
  
requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
});