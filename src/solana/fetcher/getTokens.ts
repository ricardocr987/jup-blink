import BigNumber from "bignumber.js";
import { getTokenMetadata, TokenMetadata } from "./getTokenMetadata";
import { getTokenAccounts } from "./getTokenAccounts";
import { getMints } from "./getMint";
import { getPrices } from "./getPrices";
import { TokenAmount } from "@solana/rpc-types";
import { Address } from "@solana/addresses";
import { rpc } from '../rpc';

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