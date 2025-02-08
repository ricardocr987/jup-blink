import { Address, address } from '@solana/addresses';
import { pipe } from '@solana/functional';
import { 
  getBase64EncodedWireTransaction,
  createTransactionMessage,
  setTransactionMessageFeePayer, 
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  compileTransaction,
  compressTransactionMessageUsingAddressLookupTables,
  Rpc,
  AddressesByLookupTableAddress,
  GetMultipleAccountsApi,
  fetchJsonParsedAccounts,
} from '@solana/web3.js';
import { prepareComputeBudget } from '../prepare';
import { TransactionData, SwapData } from '../types';
import { getTransactionInstructions } from './instructions';
import { rpc } from '../../rpc';

export interface TransactionResponse {
  transaction: string;
  nextSwapsInfo?: {
    remainingSwaps: SwapData[];
    account: string;
    slippageBps: number;
  };
}

export async function buildTransaction(
  data: TransactionData & { feeAmount?: number }, 
  priorityLevel?: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
): Promise<TransactionResponse> {
    const currentSwaps = data.swaps.slice(0, 3);
    const remainingSwaps = data.swaps.slice(3);

    const transactionData = {
      ...data,
      swaps: currentSwaps,
      feeAmount: data.feeAmount
    };

    const { instructions, lookupTableAddresses } = 
      await getTransactionInstructions(transactionData);
      
    const lookupTableAccounts = await fetchLookupTables(
      lookupTableAddresses as Address[], 
      rpc
    );

    const finalInstructions = await prepareComputeBudget(
      instructions,
      data.signer,
      lookupTableAccounts,
      priorityLevel
    );

    const fromPubkey = address(data.signer);
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      tx => setTransactionMessageFeePayer(fromPubkey, tx),
      tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      tx => appendTransactionMessageInstructions(finalInstructions, tx),
    );

    const messageWithLookupTables = compressTransactionMessageUsingAddressLookupTables(
      message, 
      lookupTableAccounts
    );
    const compiledMessage = compileTransaction({
      ...messageWithLookupTables,
      lifetimeConstraint: latestBlockhash
    });
    
    const transaction = getBase64EncodedWireTransaction(compiledMessage).toString();

    if (remainingSwaps.length > 0) {
      return {
        transaction,
        nextSwapsInfo: {
          remainingSwaps,
          account: data.signer,
          slippageBps: data.slippageBps,
        }
      };
    }

    return { transaction };
}

type FetchedAddressLookup = {
  addresses: Address[];
};

async function fetchLookupTables(
  lookupTableAddresses: Address[],
  rpc: Rpc<GetMultipleAccountsApi>,
): Promise<AddressesByLookupTableAddress> {
  if (lookupTableAddresses.length === 0) {
    return {};
  }

  const fetchedLookupTables = await fetchJsonParsedAccounts<FetchedAddressLookup[]>(
      rpc,
      lookupTableAddresses,
  );

  return fetchedLookupTables.reduce<AddressesByLookupTableAddress>((acc, lookup: any) => {
      return {
          ...acc,
          [lookup.address]: lookup.data.addresses,
      };
  }, {});
}