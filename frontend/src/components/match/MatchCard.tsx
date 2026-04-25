import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Coins, Clock, ArrowRight, Play, Eye } from 'lucide-react';
import type { Match } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatTokenAmount, getRelativeTime } from '../../utils/helpers';

interface MatchCardProps {
  match: Match;
  onJoin: (matchId: string) => void;
  isJoining: boolean;
  walletAddress: string | null;
}

export default function MatchCard({ match, onJoin, isJoining, walletAddress }: MatchCardProps) {
  const navigate = useNavigate();
  const isFull = match.players.length >= match.maxPlayers;
  const isCreator = walletAddress === match.creator;
  const hasJoined = match.players.some((p) => p.address === walletAddress);
  const spotsLeft = match.maxPlayers - match.players.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sf-card group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Badge status={match.status} />
        <span className="text-xs text-sf-text-muted">{getRelativeTime(match.createdAt)}</span>
      </div>

      {/* Entry Fee */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-sf-purple/20 to-sf-purple/5">
          <Coins size={20} className="text-sf-purple-light" />
        </div>
        <div>
          <p className="text-xs text-sf-text-muted">Entry Fee</p>
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {formatTokenAmount(match.entryFee)}
          </p>
        </div>
      </div>

      {/* Prize Pool */}
      <div className="mb-4 p-3 rounded-xl bg-sf-emerald/5 border border-sf-emerald/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-sf-text-secondary">Prize Pool</span>
          <span className="text-sm font-bold text-sf-emerald-light sf-glow-text-emerald">
            {formatTokenAmount(match.poolAmount)}
          </span>
        </div>
      </div>

      {/* Players */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sf-text-secondary">
          <Users size={16} />
          <span className="text-sm">{match.players.length}/{match.maxPlayers} Players</span>
        </div>
        {spotsLeft > 0 && match.status === 'waiting' && (
          <span className="text-xs text-sf-amber">
            {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left
          </span>
        )}
      </div>

      {/* Player Progress Bar */}
      <div className="w-full h-2 bg-sf-surface rounded-full mb-5 overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-sf-purple to-sf-cyan"
          initial={{ width: 0 }} animate={{ width: `${(match.players.length / match.maxPlayers) * 100}%` }}
          transition={{ duration: 0.5 }} />
      </div>

      {/* Action Buttons */}

      {/* Waiting: Join button for non-members */}
      {match.status === 'waiting' && !hasJoined && !isCreator && (
        <Button variant="primary" className="w-full" onClick={() => onJoin(match.id)}
          loading={isJoining} disabled={isFull || !walletAddress} icon={<ArrowRight size={16} />}>
          {!walletAddress ? 'Connect Wallet to Join' : isFull ? 'Match Full' : `Join for ${formatTokenAmount(match.entryFee)}`}
        </Button>
      )}

      {/* Waiting: Already joined — waiting state */}
      {hasJoined && match.status === 'waiting' && (
        <div className="text-center py-2">
          <div className="flex items-center justify-center gap-2 text-sf-cyan">
            <Clock size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm font-medium">Waiting for players...</span>
          </div>
        </div>
      )}

      {/* Waiting: Creator label */}
      {isCreator && match.status === 'waiting' && (
        <div className="text-center py-2">
          <span className="text-xs text-sf-purple-light font-medium">Your match</span>
        </div>
      )}

      {/* Fix 9: In Progress — Resume button for joined players */}
      {match.status === 'in_progress' && hasJoined && (
        <Button variant="primary" className="w-full" onClick={() => navigate(`/arena/${match.id}`)}
          icon={<Play size={16} />}>
          Resume Match
        </Button>
      )}

      {/* Fix 9: In Progress — spectator label for non-members */}
      {match.status === 'in_progress' && !hasJoined && (
        <div className="text-center py-2">
          <span className="text-xs text-sf-text-muted">Match in progress</span>
        </div>
      )}

      {/* Fix 9: Completed — View Results button */}
      {match.status === 'completed' && (
        <Button variant="secondary" className="w-full" onClick={() => navigate(`/results/${match.id}`, {
          state: { score: 0, match, playerAddress: walletAddress },
        })} icon={<Eye size={16} />}>
          View Results
        </Button>
      )}
    </motion.div>
  );
}
