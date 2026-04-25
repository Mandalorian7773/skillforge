import { motion } from 'framer-motion';
import { Zap, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Match } from '../../types';
import Badge from '../ui/Badge';
import { formatTokenAmount, getRelativeTime } from '../../utils/helpers';

interface LiveMatchesProps {
  matches: Match[];
}

export default function LiveMatches({ matches }: LiveMatchesProps) {
  const navigate = useNavigate();
  const liveMatches = matches.filter((m) => m.status === 'waiting' || m.status === 'in_progress');

  if (liveMatches.length === 0) {
    return (
      <div className="sf-card-static text-center py-10">
        <Zap size={32} className="mx-auto text-sf-text-muted mb-3" />
        <p className="text-sf-text-secondary mb-1">No live matches</p>
        <p className="text-sm text-sf-text-muted">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {liveMatches.slice(0, 5).map((match, index) => (
        <motion.div
          key={match.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => navigate(`/matches/${match.id}`)}
          className="sf-card flex items-center gap-4 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-sf-purple/20 to-sf-cyan/10">
            <Zap size={18} className="text-sf-purple-light" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge status={match.status} />
              <span className="text-xs text-sf-text-muted">
                {getRelativeTime(match.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-sf-emerald-light font-semibold">
                {formatTokenAmount(match.poolAmount)}
              </span>
              <span className="text-sf-text-muted flex items-center gap-1">
                <Users size={12} />
                {match.players.length}/{match.maxPlayers}
              </span>
            </div>
          </div>

          <ArrowRight size={16} className="text-sf-text-muted group-hover:text-sf-purple-light transition-colors" />
        </motion.div>
      ))}
    </div>
  );
}
