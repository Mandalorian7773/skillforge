/**
 * Custom hook for executing Move contract transactions via InterwovenKit.
 * Wraps transaction signing, broadcasting, and tx hash extraction.
 */

import { useCallback, useState } from 'react';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import { SKILLFORGE_CONTRACT_ADDRESS } from '../utils/constants';

export interface TxResult {
  success: boolean;
  txHash: string;
  error?: string;
}

/**
 * Hook for interacting with the SkillForge Move contract on-chain.
 * Provides functions to create matches, join matches, and claim rewards.
 */
export function useContractTx() {
  const kit = useInterwovenKit();
  const [loading, setLoading] = useState(false);

  /**
   * Execute a Move module function call via the wallet.
   */
  const executeMoveCall = useCallback(async (
    functionName: string,
    typeArgs: string[],
    args: string[],
  ): Promise<TxResult> => {
    if (!kit.isConnected || !kit.address) {
      return { success: false, txHash: '', error: 'Wallet not connected' };
    }

    setLoading(true);
    try {
      // Use InterwovenKit's requestTx for Move module calls
      const moduleAddress = SKILLFORGE_CONTRACT_ADDRESS || '0x1';
      const msg = {
        typeUrl: '/initia.move.v1.MsgExecute',
        value: {
          sender: kit.address,
          module_address: moduleAddress,
          module_name: 'skillforge',
          function_name: functionName,
          type_args: typeArgs,
          args: args,
        },
      };

      // requestTx returns the tx hash on success
      const result = await kit.requestTxSync({
        messages: [msg],
        memo: `SkillForge: ${functionName}`,
      });

      const txHash = typeof result === 'string' ? result : (result as any)?.txHash || '';

      return { success: true, txHash };
    } catch (err: any) {
      console.error(`[ContractTx] ${functionName} failed:`, err);
      return { success: false, txHash: '', error: err.message || 'Transaction failed' };
    } finally {
      setLoading(false);
    }
  }, [kit]);

  const createMatchOnChain = useCallback(async (entryFee: number, maxPlayers: number) => {
    // Convert INIT to uinit (micro)
    const entryFeeUinit = Math.floor(entryFee * 1_000_000).toString();
    return executeMoveCall('create_match', [], [entryFeeUinit, maxPlayers.toString()]);
  }, [executeMoveCall]);

  const joinMatchOnChain = useCallback(async (matchId: number) => {
    return executeMoveCall('join_match', [], [matchId.toString()]);
  }, [executeMoveCall]);

  const claimRewardOnChain = useCallback(async (matchId: number) => {
    return executeMoveCall('distribute_rewards', [], [matchId.toString()]);
  }, [executeMoveCall]);

  return {
    loading,
    createMatchOnChain,
    joinMatchOnChain,
    claimRewardOnChain,
    executeMoveCall,
    isConnected: kit.isConnected ?? false,
    address: kit.address ?? null,
  };
}
