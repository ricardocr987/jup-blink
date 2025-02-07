import { 
  createDefaultRpcTransport, 
  createRpc, 
  createSolanaRpcApi,
} from "@solana/rpc";
import { createSolanaRpcSubscriptions } from "@solana/web3.js";
import { config } from "../config";

// RPC HTTP Transport
const heliusRpcTransport = createDefaultRpcTransport({ 
  url: process.env.RPC_ENDPOINT!
});

// Create API
const solanaApi = createSolanaRpcApi({ defaultCommitment: 'confirmed' });

// Create RPC client
export const rpc = createRpc({ 
  api: solanaApi, 
  transport: heliusRpcTransport 
});

const wsEndpoint = config.RPC_ENDPOINT.replace('https://', 'wss://');
export const rpcSubscriptions = createSolanaRpcSubscriptions(wsEndpoint);