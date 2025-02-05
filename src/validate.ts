import { ActionPostResponse } from "@solana/actions";
import { getMainTokens } from "./solana/fetcher/getTokens";
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import BigNumber from "bignumber.js";

export const message = 'Connect your wallet to swap tokens into a diversified portfolio';
export function verifySignature(message: string, signature: string, account: string) {
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = bs58.decode(signature);
  const publicKeyBytes = bs58.decode(account);
  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    Uint8Array.from(publicKeyBytes),
  );
}

export async function validateTokenAmount(
  account: string,
  inputToken: string,
  amount: string
): Promise<{ isValid: boolean; error?: ActionPostResponse }> {
  try {
    const userTokens = await getMainTokens(account);
    const selectedToken = userTokens.find(t => t.mint === inputToken);

    if (!selectedToken) {
      return {
        isValid: false,
        error: {
          type: 'transaction',
          transaction: '',
          message: 'Selected token not found in wallet',
        } satisfies ActionPostResponse
      };
    }

    const inputAmount = new BigNumber(amount);
    const userBalance = new BigNumber(selectedToken.amount);

    if (inputAmount.isGreaterThan(userBalance)) {
      return {
        isValid: false,
        error: {
          type: 'transaction',
          transaction: '',
          message: `Insufficient balance. You have ${userBalance.toFixed(4)} ${selectedToken.metadata.symbol}`,
        } satisfies ActionPostResponse
      };
    }

    if (inputAmount.isLessThanOrEqualTo(0)) {
      return {
        isValid: false,
        error: {
          type: 'transaction',
          transaction: '',
          message: 'Amount must be greater than 0',
        } satisfies ActionPostResponse
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error validating token amount:', error);
    return {
      isValid: false,
      error: {
        type: 'transaction',
        transaction: '',
        message: 'Failed to validate token amount',
      } satisfies ActionPostResponse
    };
  }
}