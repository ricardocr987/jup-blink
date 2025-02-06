import { 
  type FullySignedTransaction, 
  type TransactionWithBlockhashLifetime,
} from '@solana/transactions';
import { 
  getBase64Decoder,
  getBase64Encoder,
  getTransactionDecoder,
} from '@solana/web3.js';
import { sendAndConfirmTransactionFactory } from '@solana/web3.js';
import { rpc } from '../rpc';
import { rpcSubscriptions } from './confirm';

const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

export async function sendTransaction(transaction: string): Promise<string> {
    const base64Encoder = getBase64Encoder();
    const transactionBytes = base64Encoder.encode(transaction);

    const transactionDecoder = getTransactionDecoder();
    const decodedTx = transactionDecoder.decode(transactionBytes) as FullySignedTransaction & TransactionWithBlockhashLifetime;

    await sendAndConfirmTransaction(
      decodedTx,
      {
        commitment: 'confirmed',
        maxRetries: 3n
      }
    );

    return '';
}