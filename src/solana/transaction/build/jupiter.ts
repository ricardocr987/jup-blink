import { RawInstruction } from "../types";
import { config } from "../../../config";

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': config.JUPITER_API_KEY
};

async function getJupiterQuote(inputToken: string, outputToken: string, amount: number, slippageBps: number) {
  const params = new URLSearchParams({
    inputMint: inputToken,
    outputMint: outputToken,
    amount: amount.toString(),
    slippageBps: slippageBps.toString()
  });

  const response = await fetch(`https://api.jup.ag/swap/v1/quote?${params}`, {
    method: 'GET',
    headers
  });

  const quote = await response.json();
  if (quote.error) {
    throw new Error(`Failed to get Jupiter quote: ${quote.error}`);
  }
  return quote;
}

async function getJupiterInstructions(quoteResponse: any, userPublicKey: string) {
  const response = await fetch('https://api.jup.ag/swap/v1/swap-instructions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      quote: quoteResponse,
      userPublicKey
    })
  });

  const swapData = await response.json();
  if (swapData.error) {
    throw new Error(`Failed to get swap instructions: ${swapData.error}`);
  }

  if (!swapData.instructions || !Array.isArray(swapData.instructions)) {
    throw new Error(`Invalid swap instructions response: ${JSON.stringify(swapData)}`);
  }

  return {
    instructions: swapData.instructions.map((ix: any) => ({
      programId: ix.programId,
      accounts: ix.accounts,
      data: ix.data
    })),
    lookupTableAddresses: swapData.lookupTableAddresses || []
  };
}

export async function buildJupiterInstructions(
  inputToken: string,
  outputToken: string,
  amount: number,
  slippageBps: number,
  userPublicKey: string
): Promise<{
  instructions: RawInstruction[];
  lookupTableAddresses: string[];
}> {
  const quote = await getJupiterQuote(
    inputToken,
    outputToken,
    amount,
    slippageBps
  );

  return getJupiterInstructions(quote, userPublicKey);
} 