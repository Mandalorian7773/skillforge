import { useEffect, Component, type PropsWithChildren, type ReactNode } from 'react';
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

// ===== Error Boundary for InterwovenKit Provider =====
// If the chain registry fetch fails, InterwovenKitProvider crashes internally
// with "Cannot read properties of undefined (reading 'filter')".
// This boundary catches that and renders children without wallet features.

interface ProviderErrorBoundaryProps extends PropsWithChildren {
  fallback: ReactNode;
}

interface ProviderErrorBoundaryState {
  hasError: boolean;
}

class ProviderErrorBoundary extends Component<ProviderErrorBoundaryProps, ProviderErrorBoundaryState> {
  constructor(props: ProviderErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[SkillForge] InterwovenKit provider failed to initialize:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ===== Inner provider that may crash =====
function InterwovenKitWrapper({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(interwovenKitStyles);
  }, []);

  return (
    <InterwovenKitProvider defaultChainId={INITIA_CHAIN_ID}>
      {children}
    </InterwovenKitProvider>
  );
}

// ===== Exported WalletProvider =====
export default function WalletProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(interwovenKitStyles);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ProviderErrorBoundary fallback={<>{children}</>}>
          <InterwovenKitWrapper>
            {children}
          </InterwovenKitWrapper>
        </ProviderErrorBoundary>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
