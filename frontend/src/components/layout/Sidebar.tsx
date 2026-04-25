import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Swords,
  Trophy,
  Zap,
  Wallet,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/matches', label: 'Matches', icon: Swords },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

interface SidebarProps {
  walletAddress: string | null;
  onConnect: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ walletAddress, onConnect, collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300 sf-glass-strong ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        style={{ borderRadius: 0, borderRight: '1px solid rgba(124, 58, 237, 0.15)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-sf-border">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sf-purple to-sf-cyan flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <h1
                className="text-lg font-bold tracking-wider"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                SKILLFORGE
              </h1>
              <p className="text-[10px] text-sf-text-muted tracking-widest uppercase">
                Compete & Earn
              </p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-sf-purple/15 text-sf-purple-light'
                    : 'text-sf-text-secondary hover:text-sf-text hover:bg-white/5'
                }`}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-sf-purple-light' : 'group-hover:text-sf-purple-light'
                  }`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium">{label}</span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-sf-purple rounded-r-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Wallet Section */}
        <div className="p-4 border-t border-sf-border">
          {walletAddress ? (
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sf-emerald to-sf-cyan flex items-center justify-center flex-shrink-0">
                <Wallet size={14} />
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs text-sf-text-secondary">Connected</p>
                  <p className="text-sm font-medium truncate">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onConnect}
              className={`sf-btn sf-btn-primary w-full ${collapsed ? 'px-2' : ''}`}
            >
              <Wallet size={16} />
              {!collapsed && 'Connect'}
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 bg-sf-surface border border-sf-border rounded-full flex items-center justify-center text-sf-text-muted hover:text-sf-text transition-colors"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </>
  );
}

function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 sf-glass-strong flex items-center justify-around py-3 px-4"
      style={{ borderRadius: 0, borderTop: '1px solid rgba(124, 58, 237, 0.15)' }}
    >
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? 'text-sf-purple-light' : 'text-sf-text-muted'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
