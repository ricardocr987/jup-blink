import { address } from '@solana/addresses';
import { type IInstruction, type IAccountMeta, type Address, AccountRole } from '@solana/web3.js';
import { createNoopSigner } from '@solana/signers';
import { TransactionData, RawInstruction } from '../types';
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

export async function getTransactionInstructions(data: TransactionData): Promise<{ instructions: IInstruction<string>[], lookupTableAddresses: string[] }> {
  const signer = createNoopSigner(address(data.signer));

  switch (data.type) {
    case 'swap': {
      const mints = await getMints([data.inputToken, data.outputToken]);
      const inputDecimals = mints[data.inputToken]?.decimals ?? 9;
      const outputDecimals = mints[data.outputToken]?.decimals ?? 9;
      const inputAmount = await calculateTokenAmount(data.inputToken, data.amount, inputDecimals);
      const outputAmount = new BigNumber(data.amount)
        .multipliedBy(new BigNumber(10).pow(outputDecimals))
        .integerValue(BigNumber.ROUND_DOWN)
        .toString();
        
      const { instructions, lookupTableAddresses } = await buildJupiterInstructions(
        data.inputToken,
        data.outputToken,
        Number(outputAmount),
        data.slippageBps,
        data.signer
      );

      /*const transferInstruction = await buildTransferInstruction(
        signer,
        data.to,
        Number(outputAmount),
        data.outputToken as Address,
        outputDecimals
      );

      instructions.push(...transferInstruction);*/

      return { instructions, lookupTableAddresses };
    }
    default:
      throw new Error('Unsupported transaction type');
  }
}