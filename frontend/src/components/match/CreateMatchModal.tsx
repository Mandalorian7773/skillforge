import { useState } from 'react';
import { Coins, Users, Zap } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { MIN_ENTRY_FEE, MAX_ENTRY_FEE, MIN_PLAYERS, MAX_PLAYERS } from '../../utils/constants';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (entryFee: number, maxPlayers: number) => Promise<void>;
  isCreating: boolean;
}

export default function CreateMatchModal({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}: CreateMatchModalProps) {
  const [entryFee, setEntryFee] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(2);

  const prizePool = entryFee * maxPlayers;
  const platformFee = prizePool * 0.05;
  const winnerReward = prizePool - platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(entryFee, maxPlayers);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Match">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entry Fee */}
        <div>
          <label className="block text-sm font-medium text-sf-text-secondary mb-2">
            <Coins size={14} className="inline mr-2" />
            Entry Fee (INIT)
          </label>
          <input
            type="range"
            min={MIN_ENTRY_FEE}
            max={MAX_ENTRY_FEE}
            step={0.1}
            value={entryFee}
            onChange={(e) => setEntryFee(Number(e.target.value))}
            className="w-full accent-sf-purple mb-2"
          />
          <div className="flex justify-between text-sm">
            <span className="text-sf-text-muted">{MIN_ENTRY_FEE} INIT</span>
            <span className="text-lg font-bold text-sf-purple-light" style={{ fontFamily: 'var(--font-heading)' }}>
              {entryFee.toFixed(1)} INIT
            </span>
            <span className="text-sf-text-muted">{MAX_ENTRY_FEE} INIT</span>
          </div>
        </div>

        {/* Max Players */}
        <div>
          <label className="block text-sm font-medium text-sf-text-secondary mb-3">
            <Users size={14} className="inline mr-2" />
            Max Players
          </label>
          <div className="flex gap-2">
            {Array.from(
              { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
              (_, i) => i + MIN_PLAYERS
            ).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setMaxPlayers(num)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  maxPlayers === num
                    ? 'bg-sf-purple text-white sf-glow-purple'
                    : 'bg-sf-surface text-sf-text-secondary hover:bg-sf-surface/80 border border-sf-border'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-sf-bg/80 border border-sf-border space-y-3">
          <h3 className="text-sm font-semibold text-sf-text-secondary uppercase tracking-wider">
            Match Summary
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-sf-text-muted">Prize Pool</span>
            <span className="font-semibold text-sf-emerald-light">
              {prizePool.toFixed(2)} INIT
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sf-text-muted">Platform Fee (5%)</span>
            <span className="text-sf-text-secondary">
              -{platformFee.toFixed(2)} INIT
            </span>
          </div>
          <div className="border-t border-sf-border pt-2 flex justify-between">
            <span className="text-sm font-semibold">Winner Takes</span>
            <span
              className="text-lg font-bold text-sf-emerald sf-glow-text-emerald"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {winnerReward.toFixed(2)} INIT
            </span>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          size="lg"
          loading={isCreating}
          icon={<Zap size={18} />}
        >
          Create Match
        </Button>
      </form>
    </Modal>
  );
}
