import { type Signature } from '@solana/keys';
import { 
  type GetEpochInfoApi, 
  type GetSignatureStatusesApi, 
  type Rpc, 
  type SendTransactionApi,
} from '@solana/rpc';
import { 
  type RpcSubscriptions, 
  type SignatureNotificationsApi, 
  type SlotNotificationsApi 
} from '@solana/rpc-subscriptions';
import { WebSocket } from 'ws';
import { rpc } from '../rpc';
import { FullySignedTransaction, sendAndConfirmTransactionFactory, TransactionError, TransactionWithBlockhashLifetime } from '@solana/web3.js';
import { config } from '../../config';
import { SignatureBytes } from '@solana/web3.js';

// WebSocket setup
const wsEndpoint = config.RPC_ENDPOINT.replace('https://', 'wss://');
const ws = new WebSocket(wsEndpoint);

// Types for WebSocket responses
interface WsNotification {
  jsonrpc: '2.0';
  method: 'signatureNotification';
  params: {
    result: {
      err: TransactionError | null;
    };
    subscription: number;
  };
}

// Create RPC subscriptions
export const rpcSubscriptions: RpcSubscriptions<SignatureNotificationsApi & SlotNotificationsApi> = {
  signatureNotifications(signature: Signature, config?: Readonly<{ commitment?: 'confirmed' | 'finalized' | 'processed' }>) {
    return {
      async subscribe(options: Readonly<{ abortSignal: AbortSignal }>) {
        const subscriptionId = await new Promise<number>((resolve) => {
          const subscribeMsg = {
            jsonrpc: '2.0',
            id: 1,
            method: 'signatureSubscribe',
            params: [
              signature,
              { commitment: config?.commitment ?? 'confirmed' }
            ]
          };

          ws.send(JSON.stringify(subscribeMsg));

          ws.once('message', (data) => {
            const response = JSON.parse(data.toString());
            resolve(response.result);
          });
        });

        const notifications = {
          async next() {
            const result = await new Promise<WsNotification['params']['result']>((resolve) => {
              const messageHandler = (data: Buffer) => {
                const response = JSON.parse(data.toString()) as WsNotification;
                if (
                  response.method === 'signatureNotification' && 
                  response.params.subscription === subscriptionId
                ) {
                  ws.removeListener('message', messageHandler);
                  resolve(response.params.result);
                }
              };

              ws.on('message', messageHandler);
              options.abortSignal.addEventListener('abort', () => {
                ws.removeListener('message', messageHandler);
              });
            });

            return { 
              done: true, 
              value: {
                context: { slot: 0n },
                value: { err: result.err }
              }
            };
          },
          [Symbol.asyncIterator]() {
            return notifications;
          },
        };

        options.abortSignal.addEventListener('abort', () => {
          ws.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'signatureUnsubscribe',
            params: [subscriptionId]
          }));
        });

        return notifications;
      }
    };
  },
  slotNotifications(_?: Record<string, never>) {
    return {
      async subscribe() {
        const iterator = {
          async next() {
            return { done: true, value: { parent: 0n, root: 0n, slot: 0n } };
          },
          [Symbol.asyncIterator]() {
            return iterator;
          },
        };
        return iterator;
      },
    };
  }
};

// Cleanup WebSocket on process exit
process.on('SIGINT', () => {
  ws.close();
  process.exit();
});

process.on('SIGTERM', () => {
  ws.close();
  process.exit();
}); 