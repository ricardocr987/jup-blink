import { RawInstruction } from "../types";
import { config } from "../../../config";

const headers = {
  'Content-Type': 'application/json',
};

async function getJupiterQuote(inputToken: string, outputToken: string, amount: number, slippageBps: number) {
  const params = new URLSearchParams({
    inputMint: inputToken,
    outputMint: outputToken,
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
    restrictIntermediateTokens: 'true',
    onlyDirectRoutes: 'true',
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
      quoteResponse,
      userPublicKey
    })
  });

  const swapData = await response.json();
  if (swapData.error) {
    throw new Error(`Failed to get swap instructions: ${swapData.error}`);
  }

  const {
    tokenLedgerInstruction,
    computeBudgetInstructions,
    setupInstructions,
    swapInstruction,
    cleanupInstruction,
    addressLookupTableAddresses
  } = swapData;

  const allInstructions = [
    ...(setupInstructions || []),
    swapInstruction,
    ...(cleanupInstruction ? [cleanupInstruction] : [])
  ].filter(Boolean);

  const instructions = allInstructions.map((ix: any) => ({
    programId: ix.programId,
    accounts: ix.accounts,
    data: ix.data
  }));

  return {
    instructions,
    lookupTableAddresses: addressLookupTableAddresses || []
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