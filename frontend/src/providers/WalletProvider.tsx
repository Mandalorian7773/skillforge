import { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { InterwovenKitProvider, initiaPrivyWalletConnector } from '@initia/interwovenkit-react';
import { SKILLFORGE_CHAIN_ID } from '../utils/constants';

const queryClient = new QueryClient();

// Define our custom local rollup chain for Wagmi
const skillforgeChain = {
  id: 1, // Wagmi numeric ID
  name: 'SkillForge AppChain',
  nativeCurrency: { name: 'INIT', symbol: 'INIT', decimals: 6 },
  rpcUrls: { default: { http: ['http://localhost:26657'] } },
} as const;

// Define custom chain registry for InterwovenKit to prevent registry fetch crashes
const customSkillforgeChainRegistry = {
  chain_id: SKILLFORGE_CHAIN_ID,
  chain_name: 'skillforge',
  pretty_name: 'SkillForge AppChain',
  network_type: 'testnet',
  bech32_prefix: 'init',
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: 'umin',
        fixed_min_gas_price: 0.15,
        low_gas_price: 0.15,
        average_gas_price: 0.15,
        high_gas_price: 0.15,
      },
    ],
  },
  staking: {
    staking_tokens: [{ denom: 'umin' }],
  },
  apis: {
    rpc: [{ address: 'http://localhost:26657', provider: 'local' }],
    rest: [{ address: 'http://localhost:1317', provider: 'local' }],
  },
} as any;

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [skillforgeChain],
  transports: {
    [skillforgeChain.id]: http(),
  },
});

export default function WalletProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <InterwovenKitProvider
          defaultChainId={SKILLFORGE_CHAIN_ID}
          customChain={customSkillforgeChainRegistry}
          theme="dark"
        >
          {children}
        </InterwovenKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
