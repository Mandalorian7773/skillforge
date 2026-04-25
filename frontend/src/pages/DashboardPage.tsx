import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Swords, Wallet } from 'lucide-react';
import StatsCards from '../components/dashboard/StatsCards';
import LiveMatches from '../components/dashboard/LiveMatches';
import Button from '../components/ui/Button';
import type { Match, UserStats } from '../types';
import type { LayoutContext } from '../components/layout/Layout';
import * as api from '../services/api';

const EMPTY_STATS: UserStats = {
  address: '',
  totalEarnings: 0,
  matchesPlayed: 0,
  matchesWon: 0,
  winRate: 0,
  currentStreak: 0,
  bestStreak: 0,
  averageScore: 0,
  difficulty: 'medium',
};

export default function DashboardPage() {
  const { walletAddress, isConnected, openConnect } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<UserStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [walletAddress]);

  const loadData = async () => {
    setLoading(true);
    try {
      const matchData = await api.getMatches();
      setMatches(matchData);
      if (walletAddress) {
        try {
          const userStats = await api.getUserStats(walletAddress);
          setStats(userStats);
        } catch {
          setStats({ ...EMPTY_STATS, address: walletAddress });
        }
      } else {
        setStats(EMPTY_STATS);
      }
    } catch {
      // Keep defaults on error
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sf-glass-strong p-8 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-sf-purple-light to-sf-cyan bg-clip-text text-transparent">
              SkillForge
            </span>
          </h1>
          <p className="text-sf-text-secondary text-lg mb-6 max-w-xl">
            Compete in skill-based challenges, prove your mastery, and earn instant blockchain rewards.
          </p>
          <div className="flex flex-wrap gap-3">
            {isConnected ? (
              <Button
                variant="primary"
                size="lg"
                icon={<Zap size={18} />}
                onClick={() => navigate('/matches')}
              >
                Quick Match
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                icon={<Wallet size={18} />}
                onClick={openConnect}
              >
                Connect Wallet to Play
              </Button>
            )}
            <Button
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/leaderboard')}
            >
              Leaderboard
            </Button>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sf-purple/10 to-sf-cyan/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-sf-emerald/5 rounded-full blur-2xl" />
      </motion.div>

      {/* Stats */}
      <div>
        <h2
          className="text-lg font-bold mb-4 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Swords size={18} className="text-sf-purple-light" />
          Your Stats
        </h2>
        {!isConnected ? (
          <div className="sf-card-static text-center py-10">
            <Wallet size={32} className="mx-auto text-sf-text-muted mb-3" />
            <p className="text-sf-text-secondary mb-4">Connect your wallet to view your stats</p>
            <Button variant="secondary" onClick={openConnect} icon={<Wallet size={16} />}>
              Connect Wallet
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="sf-skeleton h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <StatsCards stats={stats} />
        )}
      </div>

      {/* Live Matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold flex items-center gap-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="sf-live-dot" />
            Live Matches
          </h2>
          <button
            onClick={() => navigate('/matches')}
            className="text-sm text-sf-purple-light hover:text-sf-purple transition-colors flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="sf-skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <LiveMatches matches={matches} />
        )}
      </div>
    </div>
  );
}
