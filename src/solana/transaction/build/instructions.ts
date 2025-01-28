import { type IInstruction, type IAccountMeta, type Address, AccountRole } from '@solana/web3.js';
import { TransactionData, SwapData, RawInstruction } from '../types';
import { buildJupiterInstructions } from './jupiter';
import { getMints } from '../../fetcher/getMint';
import { getTokenPrice } from '../../birdeye';
import { BigNumber } from 'bignumber.js';

export function deserializeInstruction(instructionData: string): IInstruction<string> {
  const instruction = JSON.parse(instructionData) as RawInstruction;
  return {
    programAddress: instruction.programId as Address<string>,
    accounts: instruction.accounts.map((key) => ({
      address: key.pubkey as Address<string>,
      role: key.isSigner 
        ? (key.isWritable ? AccountRole.WRITABLE_SIGNER : AccountRole.READONLY_SIGNER)
        : (key.isWritable ? AccountRole.WRITABLE : AccountRole.READONLY)
    } satisfies IAccountMeta<string>)),
    data: Buffer.from(instruction.data, "base64")
  };
}

async function calculateTokenAmount(tokenMint: string, usdcAmount: number, decimals: number): Promise<string> {
  const tokenPrice = await getTokenPrice(tokenMint);
  
  const tokenAmount = new BigNumber(usdcAmount).dividedBy(tokenPrice);
  const rawAmount = tokenAmount.multipliedBy(new BigNumber(10).pow(decimals));
  
  return rawAmount.integerValue(BigNumber.ROUND_DOWN).toString();
}

async function processSwap(
  swap: SwapData,
  mints: Record<string, { decimals: number }>,
  signer: string
): Promise<{
  instructions: IInstruction<string>[];
  lookupTableAddresses: string[];
}> {
  const inputDecimals = mints[swap.inputToken]?.decimals ?? 9;
  
  const inputAmount = await calculateTokenAmount(
    swap.inputToken,
    swap.amount,
    inputDecimals
  );
  
  const jupiterResponse = await buildJupiterInstructions(
    swap.inputToken,
    swap.outputToken,
    Number(inputAmount),
    swap.slippageBps,
    signer
  );

  return {
    instructions: jupiterResponse.instructions.map(ix => deserializeInstruction(JSON.stringify(ix))),
    lookupTableAddresses: jupiterResponse.lookupTableAddresses
  };
}

export async function getTransactionInstructions(
  data: TransactionData
): Promise<{ 
  instructions: IInstruction<string>[],
  lookupTableAddresses: string[] 
}> {
  switch (data.type) {
    case 'swap': {
      const uniqueMints = [...new Set(
        data.swaps.flatMap(swap => [swap.inputToken, swap.outputToken])
      )];
      const mints = await getMints(uniqueMints);
      const swapResults = await Promise.all(
        data.swaps.map(swap => processSwap(
          { ...swap, slippageBps: data.slippageBps },
          mints,
          data.signer
        ))
      );

      const instructions = swapResults.flatMap(result => result.instructions);
      const lookupTableAddresses = [...new Set(
        swapResults.flatMap(result => result.lookupTableAddresses)
      )];

      return { instructions, lookupTableAddresses };
    }
    default:
      throw new Error('Unsupported transaction type');
  }
}