import { 
  type FullySignedTransaction, 
  type TransactionWithBlockhashLifetime,
  getBase64Encoder,
  getTransactionDecoder
} from '@solana/web3.js';
import { sendAndConfirmTransaction } from './confirm';

export async function sendTransaction(transaction: string): Promise<string> {
    const base64Encoder = getBase64Encoder();
    const transactionBytes = base64Encoder.encode(transaction);

    const transactionDecoder = getTransactionDecoder();
    const decodedTx = transactionDecoder.decode(transactionBytes) as FullySignedTransaction & TransactionWithBlockhashLifetime;

    const signature = Object.entries(decodedTx.signatures)[0]?.[1]?.toString();
    if (!signature) throw new Error('No signature found');

    await sendAndConfirmTransaction(
      decodedTx,
      {
        commitment: 'confirmed',
        maxRetries: 3n
      }
    );
    
    return signature;
}