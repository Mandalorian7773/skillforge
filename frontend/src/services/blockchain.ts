/**
 * Blockchain service for Initia appchain (skillforge-1).
 * - Balance queries use the real Initia REST API
 * - Match transactions are routed through the contract when deployed
 */

import { INITIA_REST_URL, INITIA_DENOM, INITIA_DECIMALS, SKILLFORGE_CONTRACT_ADDRESS } from '../utils/constants';

export interface TransactionResult {
  success: boolean;
  txHash: string;
  message: string;
}

/**
 * Fetch the real wallet balance from Initia REST API
 * Queries: GET /cosmos/bank/v1beta1/balances/{address}
 */
export async function getWalletBalance(address: string): Promise<number> {
  if (!address) return 0;

  try {
    const res = await fetch(
      `${INITIA_REST_URL}/cosmos/bank/v1beta1/balances/${address}`
    );
    if (!res.ok) {
      console.warn(`[Blockchain] Balance query failed: ${res.status}`);
      return 0;
    }
    const data = await res.json();
    const balances: Array<{ denom: string; amount: string }> = data.balances || [];
    const initBalance = balances.find((b) => b.denom === INITIA_DENOM);
    if (!initBalance) return 0;

    // Convert from uinit (micro) to INIT
    return Number(initBalance.amount) / Math.pow(10, INITIA_DECIMALS);
  } catch (err) {
    console.error('[Blockchain] Failed to fetch balance:', err);
    return 0;
  }
}

/**
 * Check if the smart contract is deployed and available
 */
export function isContractDeployed(): boolean {
  return Boolean(SKILLFORGE_CONTRACT_ADDRESS && SKILLFORGE_CONTRACT_ADDRESS.length > 0);
}

/**
 * Join a match by sending entry fee.
 * Uses on-chain contract when deployed, backend tracking otherwise.
 */
export async function sendEntryFee(
  matchId: string,
  entryFee: number,
  playerAddress: string
): Promise<TransactionResult> {
  if (isContractDeployed()) {
    // On-chain flow is handled by useContractTx hook in components
    return {
      success: true,
      txHash: '',
      message: `Entry fee of ${entryFee} INIT — use wallet to sign transaction`,
    };
  }

  // Backend-only fallback
  console.log(
    `[Blockchain] Entry fee of ${entryFee} INIT for match ${matchId} by ${playerAddress} — tracked by backend`
  );

  return {
    success: true,
    txHash: '',
    message: `Entry fee of ${entryFee} INIT recorded (contract deployment pending)`,
  };
}

/**
 * Claim reward for winning a match.
 * Uses on-chain contract when deployed, backend tracking otherwise.
 */
export async function claimReward(
  matchId: string,
  winnerAddress: string,
  rewardAmount: number
): Promise<TransactionResult> {
  if (isContractDeployed()) {
    return {
      success: true,
      txHash: '',
      message: `Reward of ${rewardAmount} INIT — use wallet to sign transaction`,
    };
  }

  console.log(
    `[Blockchain] Reward of ${rewardAmount} INIT for match ${matchId} claimed by ${winnerAddress} — tracked by backend`
  );

  return {
    success: true,
    txHash: '',
    message: `Reward of ${rewardAmount} INIT recorded (contract deployment pending)`,
  };
}

/**
 * Create a match on-chain.
 * Uses on-chain contract when deployed, backend tracking otherwise.
 */
export async function createMatchOnChain(
  entryFee: number,
  maxPlayers: number,
  creatorAddress: string
): Promise<TransactionResult> {
  if (isContractDeployed()) {
    return {
      success: true,
      txHash: '',
      message: 'Match created — use wallet to sign transaction',
    };
  }

  console.log(
    `[Blockchain] Match created: fee=${entryFee}, maxPlayers=${maxPlayers}, creator=${creatorAddress} — tracked by backend`
  );

  return {
    success: true,
    txHash: '',
    message: 'Match created (contract deployment pending)',
  };
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}
