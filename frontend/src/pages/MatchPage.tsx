import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Swords, RefreshCw, Wallet } from 'lucide-react';
import MatchCard from '../components/match/MatchCard';
import CreateMatchModal from '../components/match/CreateMatchModal';
import Button from '../components/ui/Button';
import type { Match } from '../types';
import type { LayoutContext } from '../components/layout/Layout';
import * as api from '../services/api';

export default function MatchPage() {
  const { walletAddress, isConnected, openConnect } = useOutletContext<LayoutContext>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [joiningMatch, setJoiningMatch] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMatches = async () => {
    try {
      const data = await api.getMatches();
      setMatches(data);
    } catch {
      // Keep existing matches on error
    }
    setLoading(false);
  };

  const handleCreate = async (entryFee: number, maxPlayers: number) => {
    if (!walletAddress) return;
    setIsCreating(true);
    try {
      // Create match via backend API (on-chain tx pending contract deployment)
      await api.createMatch({
        creatorAddress: walletAddress,
        entryFee,
        maxPlayers,
      });
      setShowCreate(false);
      await loadMatches();
    } catch (err) {
      console.error('Create match error:', err);
    }
    setIsCreating(false);
  };

  const handleJoin = async (matchId: string) => {
    if (!walletAddress) {
      openConnect();
      return;
    }
    setJoiningMatch(matchId);
    try {
      // Join match via backend API (on-chain tx pending contract deployment)
      await api.joinMatch(matchId, { playerAddress: walletAddress });
      await loadMatches();
    } catch (err) {
      console.error('Join match error:', err);
    }
    setJoiningMatch(null);
  };

  const waitingMatches = matches.filter((m) => m.status === 'waiting');
  const activeMatches = matches.filter((m) => m.status === 'in_progress');
  const completedMatches = matches.filter((m) => m.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Swords size={24} className="text-sf-purple-light" />
            Matches
          </h1>
          <p className="text-sf-text-secondary mt-1">
            Create or join skill-based matches
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadMatches} icon={<RefreshCw size={16} />}>
            Refresh
          </Button>
          {isConnected ? (
            <Button
              variant="primary"
              onClick={() => setShowCreate(true)}
              icon={<Plus size={16} />}
            >
              Create Match
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={openConnect}
              icon={<Wallet size={16} />}
            >
              Connect to Create
            </Button>
          )}
        </div>
      </div>

      {/* Waiting Matches */}
      {waitingMatches.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-sf-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sf-amber" />
            Open Matches ({waitingMatches.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {waitingMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onJoin={handleJoin}
                isJoining={joiningMatch === match.id}
                walletAddress={walletAddress}
              />
            ))}
          </div>
        </section>
      )}

      {/* Active Matches */}
      {activeMatches.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-sf-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="sf-live-dot" />
            In Progress ({activeMatches.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onJoin={handleJoin}
                isJoining={false}
                walletAddress={walletAddress}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completedMatches.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-sf-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sf-text-muted" />
            Completed ({completedMatches.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onJoin={handleJoin}
                isJoining={false}
                walletAddress={walletAddress}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && matches.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Swords size={56} className="mx-auto text-sf-text-muted mb-4" />
          <h3 className="text-xl font-bold text-sf-text-secondary mb-2">No matches yet</h3>
          <p className="text-sf-text-muted mb-6">Be the first to create a match!</p>
          {isConnected ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreate(true)}
              icon={<Plus size={18} />}
            >
              Create First Match
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={openConnect}
              icon={<Wallet size={18} />}
            >
              Connect Wallet to Create
            </Button>
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="sf-skeleton h-64 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateMatchModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
        isCreating={isCreating}
      />
    </div>
  );
}
