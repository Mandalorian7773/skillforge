import { useEffect, type PropsWithChildren } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
} from '@initia/interwovenkit-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore styles import
import interwovenKitStyles from '@initia/interwovenkit-react/styles.js';
import { INITIA_CHAIN_ID } from '../utils/constants';

// Minimal Wagmi config — InterwovenKit handles Initia chain selection.
// We define a custom chain to avoid referencing Ethereum mainnet.
const skillforgeChain = {
  id: 1,
  name: 'SkillForge',
  nativeCurrency: { name: 'INIT', symbol: 'INIT', decimals: 6 },
  rpcUrls: { default: { http: ['http://localhost:26657'] } },
} as const;

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [skillforgeChain],
  transports: {
    [skillforgeChain.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

export default function WalletProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(interwovenKitStyles);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider defaultChainId={INITIA_CHAIN_ID}>
          {children}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
