import { motion } from 'framer-motion';
import { Coins, Trophy, Target, Flame } from 'lucide-react';
import { StatCard } from '../ui/Card';
import { formatTokenAmount } from '../../utils/helpers';
import type { UserStats } from '../../types';

interface StatsCardsProps {
  stats: UserStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Earnings',
      value: formatTokenAmount(stats.totalEarnings),
      icon: <Coins size={22} className="text-sf-emerald" />,
      color: 'emerald' as const,
      trend: { value: 12, positive: true },
    },
    {
      label: 'Matches Played',
      value: stats.matchesPlayed,
      icon: <Target size={22} className="text-sf-purple-light" />,
      color: 'purple' as const,
      trend: { value: 8, positive: true },
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      icon: <Trophy size={22} className="text-sf-cyan" />,
      color: 'cyan' as const,
      trend: { value: 3, positive: true },
    },
    {
      label: 'Win Streak',
      value: stats.currentStreak,
      icon: <Flame size={22} className="text-sf-amber" />,
      color: 'amber' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}
