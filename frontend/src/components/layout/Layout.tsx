import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getWalletBalance } from '../../services/blockchain';

// ===== Layout =====
// Wallet integration is disabled — InterwovenKit crashes on unregistered chains.
// The layout renders in "disconnected" mode with full UI visible.

interface LayoutInnerProps {
  walletAddress: string | null;
  balance: number;
  isConnected: boolean;
  openConnect: () => void;
  openWallet: () => void;
  fetchBalance: string | null;
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

export default function Layout() {
  return (
    <LayoutInner
      walletAddress={null}
      balance={0}
      isConnected={false}
      openConnect={() => {
        alert('Wallet connection will be available once the SkillForge chain is registered in the Initia chain registry.');
      }}
      openWallet={() => {}}
      fetchBalance={null}
    />
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
