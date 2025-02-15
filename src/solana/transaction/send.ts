import { 
  getSignatureFromTransaction,
  type FullySignedTransaction, 
  type TransactionWithBlockhashLifetime,
} from '@solana/transactions';
import { 
  getBase64Encoder,
  getTransactionDecoder,
  getCompiledTransactionMessageDecoder,
  decompileTransactionMessageFetchingLookupTables
} from '@solana/web3.js';
import { sendAndConfirmTransactionFactory } from '@solana/web3.js';
import { rpc, rpcSubscriptions } from '../rpc';

const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
const base64Encoder = getBase64Encoder();
const transactionDecoder = getTransactionDecoder();
const compiledTransactionMessageDecoder = getCompiledTransactionMessageDecoder();

export async function sendTransaction(transaction: string): Promise<string> {
    const transactionBytes = base64Encoder.encode(transaction);    
    const decodedTx = transactionDecoder.decode(transactionBytes);
    const compiledTransactionMessage = compiledTransactionMessageDecoder.decode(decodedTx.messageBytes);
    const decompiledTransactionMessage = await decompileTransactionMessageFetchingLookupTables(
      compiledTransactionMessage,
      rpc,
    );
    const signedTransactionWithLifetime = {
      ...decodedTx,
      lifetimeConstraint: decompiledTransactionMessage.lifetimeConstraint,
    } as FullySignedTransaction & TransactionWithBlockhashLifetime;

    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        await sendAndConfirmTransaction(
          signedTransactionWithLifetime,
          {
            commitment: 'confirmed',
            skipPreflight: true
          }
        );

        return getSignatureFromTransaction(signedTransactionWithLifetime);
      } catch (error) {
        retries++;
        console.error('Error sending transaction:', error);
      }
    }

    throw new Error('Failed to send transaction');
}