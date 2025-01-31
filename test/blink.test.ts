import { describe, expect, it } from "bun:test";
import { fetch } from "undici";
import bs58 from 'bs58';
import nacl from 'tweetnacl';

const ALEXANDRIA_API_URL = process.env.ALEXANDRIA_API_URL || 'http://localhost:8000';
const BLINK_API_URL = process.env.BLINK_API_URL || 'http://localhost:3000';

// Test wallet for signing
const testKeypair = nacl.sign.keyPair();
const testAccount = bs58.encode(testKeypair.publicKey);

// Use known portfolio ID
const portfolioId = "5b473263-9b5d-462e-b5ef-e7a8f4ab19fd:grandpa-portfolio";

describe('Portfolio Swap Blink Tests', () => {
  it('should get action metadata', async () => {
    const response = await fetch(`${BLINK_API_URL}/actions.json`);
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.rules).toBeDefined();
    expect(data.metadata).toBeDefined();
  });

  it('should get portfolio action', async () => {
    const response = await fetch(`${BLINK_API_URL}/api/actions/portfolio-swap/${portfolioId}`);
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.type).toBe('action');
    expect(data.links.actions).toBeDefined();
  });

  it('should get message to sign', async () => {
    const response = await fetch(`${BLINK_API_URL}/api/actions/portfolio-swap/${portfolioId}`, {
      method: 'POST'
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.type).toBe('message');
    expect(data.data).toBeDefined();
    
    // Sign the message
    const messageBytes = new TextEncoder().encode(data.data);
    const signature = nacl.sign.detached(messageBytes, testKeypair.secretKey);
    const signatureBase58 = bs58.encode(signature);

    // Verify signature
    const verifyResponse = await fetch(`${BLINK_API_URL}/api/actions/portfolio-swap/${portfolioId}/verify-signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signature: signatureBase58,
        account: testAccount
      })
    });
    expect(verifyResponse.ok).toBe(true);
    const verifyData = await verifyResponse.json();
    expect(verifyData.type).toBe('action');
    expect(verifyData.links.actions).toBeDefined();
  });

  it('should build transaction', async () => {
    // Use USDC as input token for test
    const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const response = await fetch(`${BLINK_API_URL}/api/actions/portfolio-swap/${portfolioId}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account: testAccount,
        data: {
          inputToken: USDC_ADDRESS,
          amount: "1000000", // 1 USDC
          slippageBps: "100"
        }
      })
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.type).toBe('transaction');
    expect(data.transaction).toBeDefined();
    expect(data.message).toBeDefined();
  });
}); 