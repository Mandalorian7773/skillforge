import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Search, Users } from 'lucide-react';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import type { LeaderboardEntry } from '../types';
import type { LayoutContext } from '../components/layout/Layout';
import * as api from '../services/api';

export default function LeaderboardPage() {
  const { walletAddress } = useOutletContext<LayoutContext>();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard();
      setEntries(data);
    } catch {
      // Keep empty on error
    }
    setLoading(false);
  };

  const filteredEntries = searchQuery
    ? entries.filter(
        (e) =>
          e.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Trophy size={24} className="text-sf-amber" />
            Leaderboard
          </h1>
          <p className="text-sf-text-secondary mt-1">
            Top performers on SkillForge
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sf-text-muted" />
          <input
            type="text"
            placeholder="Search player..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sf-input pl-10"
          />
        </div>
      </div>

      {/* Top 3 Cards */}
      {!loading && filteredEntries.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filteredEntries.slice(0, 3).map((entry, index) => {
            const colors = [
              { bg: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/5' },
              { bg: 'from-gray-400/20 to-gray-500/5', border: 'border-gray-400/30', text: 'text-gray-300', glow: '' },
              { bg: 'from-orange-600/20 to-orange-700/5', border: 'border-orange-600/30', text: 'text-orange-400', glow: '' },
            ];
            const style = colors[index];
            const medal = ['🥇', '🥈', '🥉'][index];

            return (
              <motion.div
                key={entry.address}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`sf-card text-center bg-gradient-to-b ${style.bg} ${style.border} ${style.glow}`}
              >
                <div className="text-4xl mb-3">{medal}</div>
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold"
                  style={{
                    background: `linear-gradient(135deg, hsl(${index * 40 + 30}, 70%, 50%), hsl(${index * 40 + 90}, 60%, 40%))`,
                  }}
                >
                  {entry.displayName?.charAt(0)}
                </div>
                <p className="font-bold text-sm">{entry.displayName}</p>
                <p className={`text-xl font-bold mt-2 ${style.text}`} style={{ fontFamily: 'var(--font-heading)' }}>
                  {entry.totalEarnings.toFixed(1)} INIT
                </p>
                <p className="text-xs text-sf-text-muted mt-1">
                  {entry.matchesWon}W / {entry.matchesPlayed}G · {entry.winRate}%
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full Table */}
      <div className="sf-card-static">
        {loading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="sf-skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <LeaderboardTable entries={filteredEntries} currentAddress={walletAddress} />
        ) : (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-sf-text-muted mb-4" />
            <h3 className="text-lg font-bold text-sf-text-secondary mb-2">No players yet</h3>
            <p className="text-sf-text-muted">
              Be the first to compete and claim your spot on the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
