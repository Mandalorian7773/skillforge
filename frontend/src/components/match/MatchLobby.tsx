import { motion } from 'framer-motion';
import { Users, Clock, Zap } from 'lucide-react';
import type { Match } from '../../types';
import { truncateAddress, formatTokenAmount } from '../../utils/helpers';

interface MatchLobbyProps {
  match: Match;
}

export default function MatchLobby({ match }: MatchLobbyProps) {
  const spotsLeft = match.maxPlayers - match.players.length;

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sf-glass-strong p-8 text-center"
      >
        {/* Animated waiting indicator */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-sf-purple/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-t-sf-purple border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-3 rounded-full bg-sf-purple/10 flex items-center justify-center">
            <Clock size={28} className="text-sf-purple-light" />
          </div>
        </div>

        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Waiting for Players
        </h2>
        <p className="text-sf-text-secondary mb-6">
          {spotsLeft > 0
            ? `${spotsLeft} more player${spotsLeft > 1 ? 's' : ''} needed to start`
            : 'Match starting...'}
        </p>

        {/* Prize info */}
        <div className="mb-6 p-4 rounded-xl bg-sf-bg/50 border border-sf-border">
          <div className="flex items-center justify-center gap-2 text-sm text-sf-text-muted mb-1">
            <Zap size={14} className="text-sf-emerald" />
            Prize Pool
          </div>
          <p
            className="text-3xl font-bold text-sf-emerald sf-glow-text-emerald"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {formatTokenAmount(match.poolAmount)}
          </p>
        </div>

        {/* Players list */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-sf-text-secondary mb-2">
            <Users size={14} />
            <span>
              Players ({match.players.length}/{match.maxPlayers})
            </span>
          </div>
          {match.players.map((player, index) => (
            <motion.div
              key={player.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-sf-surface/50 border border-sf-border"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: `hsl(${index * 90}, 70%, 50%)`,
                }}
              >
                {index + 1}
              </div>
              <span className="text-sm font-medium">
                {player.displayName || truncateAddress(player.address)}
              </span>
              {index === 0 && (
                <span className="ml-auto text-xs text-sf-amber">Creator</span>
              )}
            </motion.div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: spotsLeft }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-sf-border/50"
            >
              <div className="w-8 h-8 rounded-full bg-sf-surface/30 flex items-center justify-center">
                <span className="text-sf-text-muted text-xs">?</span>
              </div>
              <span className="text-sm text-sf-text-muted">Waiting...</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
