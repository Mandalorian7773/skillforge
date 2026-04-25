import type { MatchStatus } from '../../types';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

interface BadgeProps {
  status: MatchStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`sf-badge ${STATUS_COLORS[status]}`}>
      {status === 'in_progress' && <span className="sf-live-dot" />}
      {STATUS_LABELS[status]}
    </span>
  );
}

interface CustomBadgeProps {
  children: React.ReactNode;
  color?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
}

export function CustomBadge({ children, color = 'purple' }: CustomBadgeProps) {
  const colorMap: Record<string, string> = {
    purple: 'bg-sf-purple/15 text-sf-purple-light border border-sf-purple/30',
    cyan: 'bg-sf-cyan/15 text-sf-cyan-light border border-sf-cyan/30',
    emerald: 'bg-sf-emerald/15 text-sf-emerald-light border border-sf-emerald/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    rose: 'bg-sf-rose/15 text-sf-rose border border-sf-rose/30',
  };

  return (
    <span className={`sf-badge ${colorMap[color]}`}>
      {children}
    </span>
  );
}
