import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Coins, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import { formatTokenAmount, createConfetti } from '../utils/helpers';
import { claimReward } from '../services/blockchain';
import { INITIA_EXPLORER_URL } from '../utils/constants';
import type { Match } from '../types';
import type { LayoutContext } from '../components/layout/Layout';

export default function ResultsPage() {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { walletAddress } = useOutletContext<LayoutContext>();

  const state = location.state as {
    score: number; match: Match; playerAddress: string;
  } | null;

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const score = state?.score ?? 0;
  const match = state?.match;

  // Fix 7: Winner is ONLY determined by on-chain/backend data + valid wallet
  const isWinner = Boolean(
    walletAddress && walletAddress.length > 0 && match?.winner && match.winner === walletAddress
  );

  const reward = match ? match.poolAmount * 0.95 : 0;

  useEffect(() => {
    if (isWinner) {
      setTimeout(() => createConfetti(80), 500);
    }
  }, [isWinner]);

  const handleClaim = async () => {
    // Fix 7: Require valid wallet and confirmed winner
    if (!match || !walletAddress || !isWinner) return;
    setClaiming(true);
    try {
      const result = await claimReward(match.id, walletAddress, reward);
      if (result.txHash) setTxHash(result.txHash);
      setClaimed(true);
      createConfetti(50);
    } catch (err) {
      console.error('Claim error:', err);
    }
    setClaiming(false);
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }} className="sf-glass-strong p-8 text-center">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }} className="mb-6">
          {isWinner ? (
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto sf-glow-emerald">
                <Trophy size={40} className="text-white" />
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-sf-emerald rounded-full flex items-center justify-center text-white text-xs font-bold">
                #1
              </motion.div>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-sf-surface flex items-center justify-center mx-auto">
              <Trophy size={40} className="text-sf-text-muted" />
            </div>
          )}
        </motion.div>

        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className={`text-3xl font-bold mb-2 ${isWinner ? 'sf-glow-text-emerald text-sf-emerald' : 'text-sf-text-secondary'}`}
          style={{ fontFamily: 'var(--font-heading)' }}>
          {isWinner ? 'VICTORY!' : 'MATCH OVER'}
        </motion.h1>

        <p className="text-sf-text-secondary mb-6">
          {isWinner ? 'Congratulations! You dominated the challenge.' : 'Better luck next time. Keep practicing!'}
        </p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mb-6 p-4 rounded-xl bg-sf-bg/50 border border-sf-border">
          <p className="text-sm text-sf-text-muted mb-1">Your Score</p>
          <p className="text-4xl font-bold text-sf-purple-light" style={{ fontFamily: 'var(--font-heading)' }}>{score}</p>
        </motion.div>

        {isWinner && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mb-6 p-6 rounded-xl bg-sf-emerald/5 border border-sf-emerald/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins size={20} className="text-sf-emerald" />
              <span className="text-sm text-sf-text-secondary">Reward</span>
            </div>
            <p className="text-4xl font-bold text-sf-emerald sf-glow-text-emerald" style={{ fontFamily: 'var(--font-heading)' }}>
              {formatTokenAmount(reward)}
            </p>
            <p className="text-xs text-sf-text-muted mt-2">After 5% platform fee</p>
          </motion.div>
        )}

        {isWinner && !claimed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-4">
            <Button variant="success" size="lg" className="w-full" onClick={handleClaim}
              loading={claiming} icon={<Coins size={18} />}>
              Claim Reward
            </Button>
          </motion.div>
        )}

        {claimed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-sf-emerald/5 border border-sf-emerald/20">
            <p className="text-sm font-medium text-sf-emerald mb-1">✓ Reward Claimed</p>
            {txHash ? (
              <>
                <p className="text-xs text-sf-text-muted mb-1">Transaction Hash</p>
                <p className="text-sm font-mono text-sf-emerald-light break-all">{txHash}</p>
                <a href={`${INITIA_EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                  className="mt-2 text-xs text-sf-cyan flex items-center gap-1 mx-auto hover:underline justify-center">
                  <ExternalLink size={12} /> View on Explorer
                </a>
              </>
            ) : (
              <p className="text-xs text-sf-text-muted">On-chain transaction will be available after contract deployment</p>
            )}
          </motion.div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={() => navigate('/matches')} icon={<RotateCcw size={16} />}>
            Play Again
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => navigate('/leaderboard')} icon={<ArrowRight size={16} />}>
            Leaderboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
