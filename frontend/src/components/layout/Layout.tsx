import React, { useState, useEffect, Component, type PropsWithChildren, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getWalletBalance } from '../../services/blockchain';

// ===== Error Boundary for InterwovenKit =====
// If the chain registry is unreachable, useInterwovenKit() throws.
// This boundary catches that and renders the app without wallet features.

interface WalletErrorBoundaryProps extends PropsWithChildren {
  fallback: ReactNode;
}

interface WalletErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WalletErrorBoundary extends Component<WalletErrorBoundaryProps, WalletErrorBoundaryState> {
  constructor(props: WalletErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.warn('[SkillForge] InterwovenKit error caught by boundary:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ===== Layout with real wallet connection =====

function WalletConnectedLayout() {
  const kit = useInterwovenKit();
  const address = kit.address ?? null;
  const isConnected = kit.isConnected ?? false;
  const openConnect = kit.openConnect ?? (() => {});
  const openWallet = kit.openWallet ?? (() => {});

  return (
    <LayoutInner
      walletAddress={isConnected ? address : null}
      balance={0}
      isConnected={isConnected}
      openConnect={openConnect}
      openWallet={openWallet}
      fetchBalance={isConnected && address ? address : null}
    />
  );
}

// ===== Fallback layout (no wallet) =====

function FallbackLayout() {
  return (
    <LayoutInner
      walletAddress={null}
      balance={0}
      isConnected={false}
      openConnect={() => {
        alert('Wallet connection is currently unavailable. The Initia chain registry could not be reached. Please check your internet connection and reload the page.');
      }}
      openWallet={() => {}}
      fetchBalance={null}
    />
  );
}

// ===== Shared layout shell =====

interface LayoutInnerProps {
  walletAddress: string | null;
  balance: number;
  isConnected: boolean;
  openConnect: () => void;
  openWallet: () => void;
  fetchBalance: string | null; // address to fetch balance for, or null
}

function LayoutInner({ walletAddress, isConnected, openConnect, openWallet, fetchBalance }: LayoutInnerProps) {
  const [balance, setBalance] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch real balance from Initia testnet when wallet is connected
  useEffect(() => {
    if (fetchBalance) {
      getWalletBalance(fetchBalance).then(setBalance);

      // Refresh balance every 30 seconds
      const interval = setInterval(() => {
        getWalletBalance(fetchBalance).then(setBalance);
      }, 30_000);
      return () => clearInterval(interval);
    } else {
      setBalance(0);
    }
  }, [fetchBalance]);

  return (
    <div className="min-h-screen sf-bg-gradient sf-bg-grid">
      <Sidebar
        walletAddress={walletAddress}
        onConnect={openConnect}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`sf-layout-main min-h-screen flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar
          walletAddress={walletAddress}
          balance={balance}
          onConnect={openConnect}
          onOpenWallet={openWallet}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet context={{ walletAddress, balance, isConnected, openConnect, openWallet }} />
        </main>
      </div>
    </div>
  );
}

// ===== Exported Layout with Error Boundary =====

export default function Layout() {
  return (
    <WalletErrorBoundary fallback={<FallbackLayout />}>
      <WalletConnectedLayout />
    </WalletErrorBoundary>
  );
}

// Hook to access layout context in pages
export type LayoutContext = {
  walletAddress: string | null;
  balance: number;
  isConnected: boolean;
  openConnect: () => void;
  openWallet: () => void;
};
