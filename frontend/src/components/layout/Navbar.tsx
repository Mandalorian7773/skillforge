import { Wallet, Bell, Zap, LogOut } from 'lucide-react';
import { truncateAddress, formatTokenAmount } from '../../utils/helpers';

interface NavbarProps {
  walletAddress: string | null;
  balance: number;
  onConnect: () => void;
  onOpenWallet: () => void;
}

export default function Navbar({ walletAddress, balance, onConnect, onOpenWallet }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 sf-glass-strong px-6 py-4 flex items-center justify-between"
      style={{ borderRadius: 0, borderBottom: '1px solid rgba(124, 58, 237, 0.1)' }}
    >
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sf-purple to-sf-cyan flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
          SKILLFORGE
        </span>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Balance */}
        {walletAddress && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-sf-emerald/10 border border-sf-emerald/20">
            <div className="w-2 h-2 rounded-full bg-sf-emerald sf-animate-pulse-glow" />
            <span className="text-sm font-semibold text-sf-emerald-light">
              {formatTokenAmount(balance)}
            </span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors text-sf-text-secondary hover:text-sf-text">
          <Bell size={20} />
        </button>

        {/* Wallet Connect */}
        {walletAddress ? (
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sf-surface border border-sf-border hover:border-sf-border-bright transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sf-purple to-sf-cyan" />
            <span className="text-sm font-medium hidden sm:block">
              {truncateAddress(walletAddress, 4)}
            </span>
          </button>
        ) : (
          <button onClick={onConnect} className="sf-btn sf-btn-primary sf-btn-sm">
            <Wallet size={16} />
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
