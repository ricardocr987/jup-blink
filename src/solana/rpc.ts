import { 
  createDefaultRpcTransport, 
  createRpc, 
  createSolanaRpcApi,
} from "@solana/rpc";

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
