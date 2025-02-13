import { type IInstruction } from '@solana/web3.js';
import { Address, address } from '@solana/addresses';
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { stakingProgram } from '../../../anchor';
import { fromLegacyTransactionInstruction } from './fromLegacyInstruction';

export interface StakingParams {
  maxStakeVoteMultiplier: number;
  minStakeDuration: bigint;
  maxStakeDuration: bigint;
  proposalActivationMinVotes: bigint;
}

export interface StakingData {
  type: 'stake' | 'withdraw' | 'extend' | 'toggle_max_lock';
  signer: string;
  locker: string;
  tokenMint: string;
  amount?: number;
  duration?: number;
  isMaxLock?: boolean;
}

export async function buildStakingInstructions(
  data: StakingData
): Promise<{
  instructions: IInstruction<string>[];
  lookupTableAddresses: string[];
}> {
  switch (data.type) {
    case 'stake': {
      if (!data.amount) throw new Error('Amount is required for staking');
      return buildIncreaseLockedAmountInstructions({ ...data, amount: data.amount });
    }
    case 'withdraw': {
      return buildWithdrawInstructions(data);
    }
    case 'extend': {
      if (!data.duration) throw new Error('Duration is required for extending lock');
      return buildExtendLockDurationInstructions({ ...data, duration: data.duration });
    }
    case 'toggle_max_lock': {
      if (data.isMaxLock === undefined) throw new Error('isMaxLock is required for toggling max lock');
      return buildToggleMaxLockInstructions({ ...data, isMaxLock: data.isMaxLock });
    }
    default:
      throw new Error('Invalid staking instruction type');
  }
}

async function buildIncreaseLockedAmountInstructions(data: StakingData & { amount: number }) {
  const [escrow] = await findEscrowPda(data.locker, data.signer);
  const [escrowTokens] = await findAssociatedTokenPda({
    mint: address(data.tokenMint),
    owner: escrow,
    tokenProgram: TOKEN_PROGRAM_ADDRESS
  });
  const [sourceTokens] = await findAssociatedTokenPda({
    mint: address(data.tokenMint),
    owner: address(data.signer),
    tokenProgram: TOKEN_PROGRAM_ADDRESS
  });

  const ix = await stakingProgram.methods
    .increaseLockedAmount(BigInt(data.amount))
    .accounts({
      locker: address(data.locker),
      escrow,
      escrowTokens,
      payer: address(data.signer),
      sourceTokens,
      tokenProgram: TOKEN_PROGRAM_ADDRESS
    })
    .instruction();

  return {
    instructions: [fromLegacyTransactionInstruction(ix)],
    lookupTableAddresses: []
  };
}

async function buildWithdrawInstructions(data: StakingData) {
  const [escrow] = await findEscrowPda(data.locker, data.signer);
  const [escrowTokens] = await findAssociatedTokenPda({
    mint: address(data.tokenMint),
    owner: escrow,
    tokenProgram: TOKEN_PROGRAM_ADDRESS
  });
  const [destinationTokens] = await findAssociatedTokenPda({
    mint: address(data.tokenMint),
    owner: address(data.signer),
    tokenProgram: TOKEN_PROGRAM_ADDRESS
  });

  const ix = await stakingProgram.methods
    .withdraw()
    .accounts({
      locker: address(data.locker),
      escrow,
      payer: address(data.signer),
      escrowTokens,
      destinationTokens,
      tokenProgram: TOKEN_PROGRAM_ADDRESS
    })
    .instruction();

  return {
    instructions: [fromLegacyTransactionInstruction(ix)],
    lookupTableAddresses: []
  };
}

async function buildExtendLockDurationInstructions(data: StakingData & { duration: number }) {
  const [escrow] = await findEscrowPda(data.locker, data.signer);

  const ix = await stakingProgram.methods
    .extendLockDuration(BigInt(data.duration))
    .accounts({
      locker: address(data.locker),
      escrow,
      escrowOwner: address(data.signer)
    })
    .instruction();

  return {
    instructions: [fromLegacyTransactionInstruction(ix)],
    lookupTableAddresses: []
  };
}

async function buildToggleMaxLockInstructions(data: StakingData & { isMaxLock: boolean }) {
  const [escrow] = await findEscrowPda(data.locker, data.signer);

  const ix = await stakingProgram.methods
    .toggleMaxLock(data.isMaxLock)
    .accounts({
      locker: address(data.locker),
      escrow,
      escrowOwner: address(data.signer)
    })
    .instruction();

  return {
    instructions: [fromLegacyTransactionInstruction(ix)],
    lookupTableAddresses: []
  };
}

// Helper functions
async function findEscrowPda(locker: string, owner: string): Promise<[Address<string>, number]> {
  return [address('escrow_pda_placeholder'), 0]; // TODO: Implement actual PDA derivation
}
