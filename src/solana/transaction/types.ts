import { Address } from '@solana/web3.js';

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export type BaseTransactionData = {
  signer: Address;
  priorityLevel?: PriorityLevel;
};

export type TransferData = BaseTransactionData & {
  type: 'transfer';
  token: Address;
  amount: number;
};

export type SwapData = {
  inputToken: string;
  outputToken: string;
  amount: number;
  slippageBps: number;
};

export type TransactionData = {
  type: 'swap';
  signer: Address;
  swaps: SwapData[];
  slippageBps: number;
};

export type SimulationResult = {
  units: number;
  error?: string;
}; 

export interface SwapInstruction {
  programId: string;
  accounts: Array<{
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }>;
  data: string;
}

export interface JupiterQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
  swapMode?: 'ExactIn' | 'ExactOut';
  dexes?: string[];
  onlyDirectRoutes?: boolean;
  asLegacyTransaction?: boolean;
}

export interface JupiterSwapParams {
  quoteResponse: any;
  userPublicKey: string;
  destinationTokenAccount?: string;
  trackingAddress?: string;
  wrapAndUnwrapSol?: boolean;
  useSharedAccounts?: boolean;
  dynamicComputeUnitLimit?: boolean;
  skipUserAccountsRpcCalls?: boolean;
  asLegacyTransaction?: boolean;
  useTokenLedger?: boolean;
}

export interface JupiterSwapInstructions {
  setupInstructions: SwapInstruction[];
  swapInstruction: SwapInstruction;
  cleanupInstruction?: SwapInstruction;
  addressLookupTableAddresses: string[];
} 

export interface RawInstruction {
  programId: string;
  accounts: Array<{
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }>;
  data: string;
} 