import { type IInstruction, type IAccountMeta, type Address, AccountRole } from '@solana/web3.js';
import { TransactionData, SwapData, RawInstruction } from '../types';
import { buildJupiterInstructions } from './jupiter';

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

async function processSwap(
  swap: SwapData,
  signer: string
): Promise<{
  instructions: IInstruction<string>[];
  lookupTableAddresses: string[];
}> {
  const jupiterResponse = await buildJupiterInstructions(
    swap.inputToken,
    swap.outputToken,
    swap.amount,
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
      const swapResults = await Promise.all(
        data.swaps.map(swap => processSwap(
          { ...swap, slippageBps: data.slippageBps },
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