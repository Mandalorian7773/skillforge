import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import ChallengeArena from '../components/challenge/ChallengeArena';
import MatchLobby from '../components/match/MatchLobby';
import Button from '../components/ui/Button';
import type { Match, Question, SubmitAnswerResponse } from '../types';
import type { LayoutContext } from '../components/layout/Layout';
import * as api from '../services/api';
import { SCORE_PER_CORRECT, TIME_BONUS_MULTIPLIER } from '../utils/constants';
import { Wallet } from 'lucide-react';

export default function ArenaPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { walletAddress, openConnect } = useOutletContext<LayoutContext>();
  const [match, setMatch] = useState<Match | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (matchId) loadMatch();
  }, [matchId]);

  useEffect(() => {
    if (match?.status === 'waiting') {
      const interval = setInterval(async () => {
        try {
          const updated = await api.getMatch(matchId!);
          setMatch(updated);
          if (updated.status === 'in_progress') startGame();
        } catch {}
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [match?.status]);

  const loadMatch = async () => {
    try {
      const data = await api.getMatch(matchId!);
      setMatch(data);
      if (data.status === 'in_progress') startGame();
    } catch {
      setError('Failed to load match. Make sure the backend server is running.');
    }
    setLoading(false);
  };

  const startGame = async () => {
    try {
      const q = await api.getQuestions(matchId!);
      setQuestions(q);
      setGameStarted(true);
    } catch {
      setError('Failed to load questions. Make sure the backend server is running.');
    }
  };

  const handleSubmitAnswer = async (
    questionId: string, answerIndex: number, timeTaken: number
  ): Promise<SubmitAnswerResponse> => {
    try {
      return await api.submitAnswer({
        matchId: matchId!, questionId, answerIndex,
        playerAddress: walletAddress || '', timeTaken,
      });
    } catch {
      const question = questions.find((q) => q.id === questionId);
      const correct = question ? answerIndex === question.correctAnswer : false;
      const timeRemaining = (question?.timeLimit || 30) - timeTaken;
      const bonus = correct ? Math.floor(timeRemaining * TIME_BONUS_MULTIPLIER) : 0;
      const scoreAwarded = correct ? SCORE_PER_CORRECT + bonus : 0;
      return { correct, correctAnswer: question?.correctAnswer ?? 0, scoreAwarded, totalScore: scoreAwarded };
    }
  };

  const handleComplete = async (finalScore: number) => {
    // Fix 8: Use the returned (updated) match data instead of stale state
    let updatedMatch = match;
    try {
      updatedMatch = await api.completeMatch(matchId!, walletAddress || undefined);
    } catch {
      // Match may already be completed
    }
    navigate(`/results/${matchId}`, {
      state: { score: finalScore, match: updatedMatch, playerAddress: walletAddress },
    });
  };

  // Fix 5: Block gameplay if wallet not connected
  if (!walletAddress) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-sf-purple/10 flex items-center justify-center mx-auto mb-6">
          <Wallet size={32} className="text-sf-purple-light" />
        </div>
        <h3 className="text-xl font-bold text-sf-text-secondary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Wallet Required
        </h3>
        <p className="text-sf-text-muted mb-6 max-w-md mx-auto">
          You must connect your wallet to participate in matches. Your wallet address is used to track scores and distribute rewards.
        </p>
        <Button variant="primary" size="lg" onClick={openConnect} icon={<Wallet size={18} />}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-sf-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sf-text-secondary">Loading match...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-sf-rose/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-sf-text-secondary mb-2">Error</h3>
        <p className="text-sf-text-muted mb-6 max-w-md mx-auto">{error}</p>
        <button onClick={() => navigate('/matches')} className="sf-btn sf-btn-secondary">Back to Matches</button>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-20">
        <p className="text-sf-text-secondary">Match not found</p>
      </div>
    );
  }

  if (match.status === 'waiting' && !gameStarted) return <MatchLobby match={match} />;

  if (gameStarted && questions.length > 0) {
    return (
      <ChallengeArena matchId={match.id} questions={questions} playerAddress={walletAddress || ''}
        onComplete={handleComplete} onSubmitAnswer={handleSubmitAnswer} />
    );
  }

  return null;
}
