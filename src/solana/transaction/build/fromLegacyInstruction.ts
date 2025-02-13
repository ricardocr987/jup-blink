import { fromLegacyPublicKey } from '@solana/compat';
import { AccountRole, IInstruction } from '@solana/instructions';


/**
 * This can be used to convert a legacy [`TransactionInstruction`](https://solana-labs.github.io/solana-web3.js/classes/TransactionInstruction.html)
 * object to an {@link IInstruction}.
 *
 * @example
 * ```ts
 * import { fromLegacyTransactionInstruction } from '@solana/compat';
 *
 * // Imagine a function that returns a legacy `TransactionInstruction`
 * const legacyInstruction = getMyLegacyInstruction();
 * const instruction = fromLegacyTransactionInstruction(legacyInstruction);
 * ```
 */
export function fromLegacyTransactionInstruction(legacyInstruction: any): IInstruction {
    const data = legacyInstruction.data?.byteLength > 0 ? Uint8Array.from(legacyInstruction.data) : undefined;
    const accounts = legacyInstruction.keys.map((accountMeta: any) =>
        Object.freeze({
            address: fromLegacyPublicKey(accountMeta.pubkey),
            role: determineRole(accountMeta.isSigner, accountMeta.isWritable),
        }),
    );
    const programAddress = fromLegacyPublicKey(legacyInstruction.programId);
    return Object.freeze({
        ...(accounts.length ? { accounts: Object.freeze(accounts) } : null),
        ...(data ? { data } : null),
        programAddress,
    });
}

function determineRole(isSigner: boolean, isWritable: boolean): AccountRole {
    if (isSigner && isWritable) return AccountRole.WRITABLE_SIGNER;
    if (isSigner) return AccountRole.READONLY_SIGNER;
    if (isWritable) return AccountRole.WRITABLE;
    return AccountRole.READONLY;
}