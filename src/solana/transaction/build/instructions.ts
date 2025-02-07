import { type IInstruction, type IAccountMeta, type Address, AccountRole, type TransactionSigner } from '@solana/web3.js';
import { TransactionData, SwapData, RawInstruction } from '../types';
import { buildJupiterInstructions } from './jupiter';
import { getTransferSolInstruction } from '@solana-program/system';
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS, decodeToken, getTransferInstruction } from "@solana-program/token";
import { config } from '../../../config';
import { address } from '@solana/addresses';
import { SOL_MINT } from '../../fetcher/getTokens';

async function createFeeTransferInstruction(
  signer: TransactionSigner,
  feeAmount: number,
  inputToken: string,
): Promise<IInstruction<string>> {
  if (inputToken === SOL_MINT) {
    return getTransferSolInstruction({ 
      source: signer,
      destination: address(config.FEE_ACCOUNT),
      amount: BigInt(feeAmount)
    });
  } else {
    const [tokenAccount] = await findAssociatedTokenPda({ 
      mint: address(inputToken), 
      owner: address(signer.address), 
      tokenProgram: TOKEN_PROGRAM_ADDRESS 
    });

    const [feeTokenAccount] = await findAssociatedTokenPda({ 
      mint: address(inputToken), 
      owner: address(config.FEE_ACCOUNT), 
      tokenProgram: TOKEN_PROGRAM_ADDRESS 
    });

    return getTransferInstruction({
      source: tokenAccount,
      destination: feeTokenAccount,
      authority: signer,
      amount: BigInt(feeAmount)
    });
  }
}

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
  data: TransactionData & { feeAmount?: number }
): Promise<{ 
  instructions: IInstruction<string>[],
  lookupTableAddresses: string[] 
}> {
  switch (data.type) {
    case 'swap': {
      const allInstructions: IInstruction<string>[] = [];
      
      if (data.feeAmount && data.swaps.length > 0) {
        const signer: TransactionSigner = {
          address: address(data.signer),
          signTransactions: () => Promise.resolve([]),
        };

        const feeInstruction = await createFeeTransferInstruction(
          signer,
          data.feeAmount,
          data.swaps[0].inputToken
        );
        allInstructions.push(feeInstruction);
      }

      const swapResults = await Promise.all(
        data.swaps.map(swap => processSwap(
          { ...swap, slippageBps: data.slippageBps },
          data.signer
        ))
      );

      // Add swap instructions after fee transfer
      allInstructions.push(...swapResults.flatMap(result => result.instructions));
      
      const lookupTableAddresses = [...new Set(
        swapResults.flatMap(result => result.lookupTableAddresses)
      )];

      return { 
        instructions: allInstructions, 
        lookupTableAddresses 
      };
    }
    default:
      throw new Error('Unsupported transaction type');
  }
}