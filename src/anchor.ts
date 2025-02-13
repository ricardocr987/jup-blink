import { Program } from "@coral-xyz/anchor";
import { referralIdl } from "./idl/referral";
import { stakingIdl } from "./idl/staking";
export const referralProgram = new Program(referralIdl);
export const stakingProgram = new Program(stakingIdl);

