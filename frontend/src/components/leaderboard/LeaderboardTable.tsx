import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '../../types';
import { truncateAddress, formatTokenAmount, calculateWinRate } from '../../utils/helpers';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentAddress?: string | null;
}

export default function LeaderboardTable({ entries, currentAddress }: LeaderboardTableProps) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'sf-rank-gold';
      case 2: return 'sf-rank-silver';
      case 3: return 'sf-rank-bronze';
      default: return 'text-sf-text-muted';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <Trophy size={48} className="mx-auto text-sf-text-muted mb-4" />
        <p className="text-sf-text-secondary">No players on the leaderboard yet</p>
        <p className="text-sm text-sf-text-muted mt-1">Be the first to compete!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-sf-text-muted uppercase tracking-wider border-b border-sf-border">
            <th className="pb-3 pl-4">Rank</th>
            <th className="pb-3">Player</th>
            <th className="pb-3 text-right">Earnings</th>
            <th className="pb-3 text-right hidden sm:table-cell">Matches</th>
            <th className="pb-3 text-right hidden md:table-cell">Win Rate</th>
            <th className="pb-3 text-right hidden lg:table-cell">Best Streak</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border/50">
          {entries.map((entry, index) => {
            const isCurrentUser = entry.address === currentAddress;
            return (
              <motion.tr
                key={entry.address}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`transition-colors hover:bg-white/[0.02] ${
                  isCurrentUser ? 'bg-sf-purple/5' : ''
                }`}
              >
                {/* Rank */}
                <td className="py-4 pl-4">
                  <span
                    className={`text-lg font-bold ${getRankStyle(entry.rank)}`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {getRankIcon(entry.rank)}
                  </span>
                </td>

                {/* Player */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, hsl(${index * 40}, 70%, 50%), hsl(${index * 40 + 60}, 70%, 40%))`,
                      }}
                    >
                      {entry.displayName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {entry.displayName || truncateAddress(entry.address)}
                      </p>
                      <p className="text-xs text-sf-text-muted">
                        {truncateAddress(entry.address, 4)}
                      </p>
                    </div>
                    {isCurrentUser && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sf-purple/20 text-sf-purple-light">
                        You
                      </span>
                    )}
                  </div>
                </td>

                {/* Earnings */}
                <td className="py-4 text-right">
                  <span className="text-sm font-bold text-sf-emerald-light">
                    {formatTokenAmount(entry.totalEarnings)}
                  </span>
                </td>

                {/* Matches */}
                <td className="py-4 text-right hidden sm:table-cell">
                  <span className="text-sm text-sf-text-secondary">
                    {entry.matchesPlayed}
                  </span>
                </td>

                {/* Win Rate */}
                <td className="py-4 text-right hidden md:table-cell">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-sf-surface rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sf-purple to-sf-cyan"
                        style={{ width: `${entry.winRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-sf-text-secondary">
                      {entry.winRate}%
                    </span>
                  </div>
                </td>

                {/* Streak */}
                <td className="py-4 text-right hidden lg:table-cell">
                  <span className="text-sm text-sf-amber">
                    🔥 {entry.bestStreak}
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
