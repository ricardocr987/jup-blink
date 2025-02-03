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
const portfolioId = "76157bc4-97d4-44f8-b53e-392103b2ab96:grandpa%20portfolio";

describe('Portfolio Swap Blink API', () => {
  it('GET /actions.json - should return valid action metadata and rules', async () => {
    const response = await fetch(`${BLINK_API_URL}/actions.json`);
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.rules).toBeDefined();
    expect(data.metadata).toBeDefined();
  });

  it('GET /api/actions/portfolio-swap/:portfolioId - should return valid portfolio action', async () => {
    const response = await fetch(`${BLINK_API_URL}/api/actions/portfolio-swap/${portfolioId}`);
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.type).toBe('action');
    expect(data.links.actions).toBeDefined();
  });

  it('POST /api/actions/portfolio-swap/:portfolioId/verify-signature - should handle signature verification for empty wallet', async () => {
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
    // Since we're using a test wallet without tokens, we expect an error response
    expect(verifyData.type).toBe('action');
    expect(verifyData.title).toBe('Error');
    expect(verifyData.description).toContain('Failed to fetch your token balances');
  });

  it('POST /api/actions/portfolio-swap/:portfolioId/transaction - should handle transaction building for empty wallet', async () => {
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
    // Since we're using a test wallet without tokens, we expect an error response
    expect(data.error).toBeDefined();
    expect(data.error.message).toBe('Portfolio not found');
    expect(data.error.code).toBe('PORTFOLIO_NOT_FOUND');
  });
}); 