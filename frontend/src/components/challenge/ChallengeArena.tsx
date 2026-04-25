import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import type { Question, SubmitAnswerResponse } from '../../types';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import { DEFAULT_TIME_LIMIT, SCORE_PER_CORRECT, TIME_BONUS_MULTIPLIER } from '../../utils/constants';

interface ChallengeArenaProps {
  matchId: string;
  questions: Question[];
  playerAddress: string;
  onComplete: (finalScore: number) => void;
  onSubmitAnswer: (questionId: string, answerIndex: number, timeTaken: number) => Promise<SubmitAnswerResponse>;
}

export default function ChallengeArena({
  matchId, questions, playerAddress, onComplete, onSubmitAnswer,
}: ChallengeArenaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIME_LIMIT);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showScorePopup, setShowScorePopup] = useState<number | null>(null);
  // Fix 6: ref tracks latest score to avoid stale closure in onComplete
  const scoreRef = useRef(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const timeLimit = currentQuestion?.timeLimit || DEFAULT_TIME_LIMIT;

  useEffect(() => {
    if (answered || !currentQuestion) return;
    setTimeRemaining(timeLimit);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { clearInterval(interval); handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, answered]);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(-1);
    setCorrectAnswer(currentQuestion?.correctAnswer ?? 0);
    setTimeout(() => moveToNext(), 2000);
  }, [answered, currentIndex, currentQuestion]);

  const handleAnswer = async (answerIndex: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(answerIndex);
    const timeTaken = timeLimit - timeRemaining;
    try {
      const result = await onSubmitAnswer(currentQuestion.id, answerIndex, timeTaken);
      setCorrectAnswer(result.correctAnswer);
      if (result.correct) {
        const ns = score + result.scoreAwarded;
        setScore(ns); scoreRef.current = ns;
        setShowScorePopup(result.scoreAwarded);
        setTimeout(() => setShowScorePopup(null), 1500);
      }
    } catch {
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      setCorrectAnswer(currentQuestion.correctAnswer);
      if (isCorrect) {
        const bonus = Math.floor(timeRemaining * TIME_BONUS_MULTIPLIER);
        const points = SCORE_PER_CORRECT + bonus;
        const ns = score + points;
        setScore(ns); scoreRef.current = ns;
        setShowScorePopup(points);
        setTimeout(() => setShowScorePopup(null), 1500);
      }
    }
    setTimeout(() => moveToNext(), 2000);
  };

  const moveToNext = () => {
    if (isLastQuestion) {
      onComplete(scoreRef.current); // Fix 6: use ref, not stale state
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswered(false); setSelectedAnswer(null); setCorrectAnswer(null);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 relative">
          <div className="p-2 rounded-xl bg-sf-purple/10">
            <Award size={20} className="text-sf-purple-light" />
          </div>
          <div>
            <p className="text-xs text-sf-text-muted">Score</p>
            <p className="text-xl font-bold text-sf-purple-light" style={{ fontFamily: 'var(--font-heading)' }}>{score}</p>
          </div>
          <AnimatePresence>
            {showScorePopup && (
              <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -30 }} exit={{ opacity: 0, y: -50 }}
                className="absolute -top-2 left-16 text-sf-emerald font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                +{showScorePopup}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Timer timeRemaining={timeRemaining} totalTime={timeLimit} />
        <div className="text-right">
          <p className="text-xs text-sf-text-muted">Match</p>
          <p className="text-sm font-mono text-sf-text-secondary">{matchId.slice(0, 8)}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <QuestionCard key={currentQuestion.id} question={currentQuestion} questionNumber={currentIndex + 1}
              totalQuestions={questions.length} onAnswer={handleAnswer} answered={answered}
              selectedAnswer={selectedAnswer} correctAnswer={correctAnswer} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
