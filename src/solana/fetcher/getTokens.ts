import BigNumber from "bignumber.js";
import { getTokenMetadata, TokenMetadata } from "./getTokenMetadata";
import { getTokenAccounts } from "./getTokenAccounts";
import { getMints } from "./getMint";
import { getPrices } from "./getPrices";
import { TokenAmount } from "@solana/rpc-types";
import { Address } from "@solana/addresses";
import { rpc } from '../rpc';
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS, decodeToken } from "@solana-program/token";
import type { EncodedAccount } from "@solana/accounts";
import { ReadonlyUint8Array } from "@solana/web3.js";
import type { Base64EncodedDataResponse, StringifiedBigInt, StringifiedNumber } from "@solana/rpc-types";

export type TokenInfo = {
  mint: string;
  address: string;
  amount: string;
  value: string;
  decimals: number;
  metadata: TokenMetadata;
};

const THRESHOLD_VALUE_USD = new BigNumber(0.1);
const WRAPPED_SOL_MINT = "So11111111111111111111111111111111111111112";
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

function calculateValue(tokenAmount: TokenAmount, decimals: number, price: number): BigNumber {
  try {
    if (!tokenAmount?.amount || tokenAmount.amount === '0') {
      return new BigNumber(0);
    }

    if (typeof decimals !== 'number' || decimals < 0) {
      console.warn('Invalid decimals:', decimals);
      return new BigNumber(0);
    }

    if (typeof price !== 'number' || isNaN(price)) {
      console.warn('Invalid price:', price);
      return new BigNumber(0);
    }

    const amount = new BigNumber(tokenAmount.amount);
    const decimalAdjustment = new BigNumber(10).pow(decimals);
    const adjustedAmount = amount.dividedBy(decimalAdjustment);
    const value = adjustedAmount.multipliedBy(price);

    return value;
  } catch (error) {
    console.error('Error calculating value:', error);
    return new BigNumber(0);
  }
}

export async function getTokens(userKey: string): Promise<TokenInfo[]> {
  try {
    const { value: solBalance } = await rpc.getBalance(userKey as Address).send();
    const solPrice = (await getPrices([WRAPPED_SOL_MINT]))[WRAPPED_SOL_MINT];
    const tokenAccounts = await getTokenAccounts(userKey as Address);

    const nonZeroAccounts = tokenAccounts.filter(account => 
      account.account.tokenAmount.amount !== '0'
    );

    const solValue = new BigNumber(solBalance.toString())
      .dividedBy(10 ** 9)
      .multipliedBy(solPrice);

    let tokens: (TokenInfo | null)[] = [];
    if (solValue.isGreaterThan(THRESHOLD_VALUE_USD)) {
      tokens.push({
        mint: WRAPPED_SOL_MINT,
        address: userKey,
        amount: new BigNumber(solBalance.toString()).dividedBy(10 ** 9).toString(),
        value: solValue.toFixed(2),
        decimals: 9,
        metadata: {
          name: "Solana",
          symbol: "SOL",
          logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          address: WRAPPED_SOL_MINT,
          decimals: 9
        }
      });
    }

    if (nonZeroAccounts.length > 0) {
      const [mints, prices] = await Promise.all([
        getMints(nonZeroAccounts.map(account => account.account.mint.toString())),
        getPrices(nonZeroAccounts.map(account => account.account.mint.toString()))
      ]);

      const otherTokens = await Promise.all(
        nonZeroAccounts.map(async ({ pubkey, account }) => {
          try {
            const mint = account.mint.toString();
            const mintData = mints[mint];
            
            if (!mintData) {
              console.warn(`No mint data found for ${mint}`);
              return null;
            }

            const price = prices[mint] ?? 0;
            const value = calculateValue(account.tokenAmount, mintData.decimals, price);
            if (value.isLessThan(THRESHOLD_VALUE_USD)) {
              return null;
            }

            let metadata: TokenMetadata | null = null;
            let retries = 3;
            
            while (retries > 0 && !metadata) {
              try {
                metadata = await getTokenMetadata(mint);
                break;
              } catch (error) {
                console.warn(`Failed to fetch metadata for ${mint}, retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }

            if (!metadata) {
              console.warn(`No metadata found for ${mint}`);
              return null;
            }

            const tokenInfo: TokenInfo = {
              mint,
              address: pubkey.toString(),
              amount: account.tokenAmount.uiAmountString || '0',
              value: value.toFixed(2),
              decimals: mintData.decimals,
              metadata
            };

            return tokenInfo;

          } catch (error) {
            console.warn(`Error processing token account ${pubkey}:`, error);
            return null;
          }
        })
      );

      tokens = [...tokens, ...otherTokens];
    }

    return tokens.filter((token): token is TokenInfo => token !== null);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    throw error;
  }
}

export async function getMainTokens(userKey: string): Promise<TokenInfo[]> {
  try {
    const prices = await getPrices([SOL_MINT, USDC_MINT]);
    const [usdcAta] = await findAssociatedTokenPda({ 
      mint: USDC_MINT as Address, 
      owner: userKey as Address, 
      tokenProgram: TOKEN_PROGRAM_ADDRESS 
    });

    const tokens: TokenInfo[] = [];

    try {
      const { value: tokenAccountResponse } = await rpc.getAccountInfo(
        usdcAta,
        { encoding: 'base64' }
      ).send();

      if (tokenAccountResponse?.data) {
        const [base64Data] = tokenAccountResponse.data as Base64EncodedDataResponse;
        if (base64Data) {
          const rawData = Buffer.from(base64Data, 'base64');
          
          const encodedAccount: EncodedAccount<string> = {
            address: usdcAta,
            data: new Uint8Array(rawData) as ReadonlyUint8Array,
            executable: tokenAccountResponse.executable,
            lamports: tokenAccountResponse.lamports,
            programAddress: tokenAccountResponse.owner,
          };

          const decodedTokenAccount = decodeToken(encodedAccount);
          
          if (decodedTokenAccount) {
            const amount = decodedTokenAccount.data.amount.toString();
            const uiAmount = Number(amount) / Math.pow(10, 6);
            
            const tokenAmount: TokenAmount = {
              amount: amount as StringifiedBigInt,
              decimals: 6,
              uiAmount,
              uiAmountString: uiAmount.toString() as StringifiedNumber
            } as const;

            const price = prices[USDC_MINT] ?? 0;
            const value = calculateValue(
              tokenAmount,
              6,
              price
            );

            if (value.isGreaterThan(THRESHOLD_VALUE_USD)) {
              const metadata = await getTokenMetadata(USDC_MINT);
              tokens.push({
                mint: USDC_MINT,
                address: usdcAta,
                amount: tokenAmount.uiAmountString,
                value: value.toFixed(2),
                decimals: 6,
                metadata
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Error processing USDC token account:`, error);
    }

    // Check native SOL balance
    const { value: solBalance } = await rpc.getBalance(userKey as Address).send();
    const solPrice = prices[SOL_MINT];
    const solValue = new BigNumber(solBalance.toString())
      .dividedBy(10 ** 9)
      .multipliedBy(solPrice);

    if (solValue.isGreaterThan(THRESHOLD_VALUE_USD)) {
      const solAmount = solBalance.toString();
      const solUiAmount = Number(solAmount) / Math.pow(10, 9);
      
      const solTokenAmount: TokenAmount = {
        amount: solAmount as StringifiedBigInt,
        decimals: 9,
        uiAmount: solUiAmount,
        uiAmountString: solUiAmount.toString() as StringifiedNumber
      } as const;

      tokens.push({
        mint: SOL_MINT,
        address: userKey,
        amount: solTokenAmount.uiAmountString,
        value: solValue.toFixed(2),
        decimals: 9,
        metadata: {
          name: "Solana",
          symbol: "SOL",
          logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          address: SOL_MINT,
          decimals: 9
        }
      });
    }

    return tokens;
  } catch (error) {
    console.error('Error fetching basic tokens:', error);
    return [];
  }
}