import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  answered: boolean;
  selectedAnswer: number | null;
  correctAnswer: number | null;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  answered,
  selectedAnswer,
  correctAnswer,
}: QuestionCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'logic': return 'text-sf-purple-light bg-sf-purple/10 border-sf-purple/20';
      case 'math': return 'text-sf-cyan-light bg-sf-cyan/10 border-sf-cyan/20';
      case 'pattern': return 'text-sf-amber bg-amber-500/10 border-amber-500/20';
      case 'code': return 'text-sf-emerald-light bg-sf-emerald/10 border-sf-emerald/20';
      default: return 'text-sf-text-secondary bg-sf-surface border-sf-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto"
    >
      {/* Question header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-sf-text-muted">
            Question {questionNumber}/{totalQuestions}
          </span>
          <span className={`sf-badge border ${getCategoryColor(question.category)}`}>
            {question.category}
          </span>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < questionNumber - 1
                  ? 'bg-sf-emerald'
                  : i === questionNumber - 1
                  ? 'bg-sf-purple sf-animate-pulse-glow'
                  : 'bg-sf-surface'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question text */}
      <div className="sf-glass-strong p-6 mb-6">
        <h3 className="text-xl font-semibold leading-relaxed">
          {question.question}
        </h3>
        {question.codeSnippet && (
          <pre className="mt-4 p-4 rounded-xl bg-sf-bg text-sm font-mono text-sf-cyan-light overflow-x-auto border border-sf-border">
            <code>{question.codeSnippet}</code>
          </pre>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((option, idx) => {
          let optionClass = 'sf-card cursor-pointer hover:border-sf-purple/50';

          if (answered) {
            if (idx === correctAnswer) {
              optionClass = 'sf-card border-sf-emerald/50 bg-sf-emerald/10';
            } else if (idx === selectedAnswer && idx !== correctAnswer) {
              optionClass = 'sf-card border-sf-rose/50 bg-sf-rose/10';
            } else {
              optionClass = 'sf-card opacity-50 cursor-default';
            }
          }

          return (
            <motion.button
              key={idx}
              whileHover={!answered ? { scale: 1.01 } : {}}
              whileTap={!answered ? { scale: 0.99 } : {}}
              onClick={() => !answered && onAnswer(idx)}
              disabled={answered}
              className={`${optionClass} text-left flex items-center gap-4 transition-all w-full`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  answered && idx === correctAnswer
                    ? 'bg-sf-emerald text-white'
                    : answered && idx === selectedAnswer
                    ? 'bg-sf-rose text-white'
                    : 'bg-sf-surface text-sf-text-secondary'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-sm font-medium">{option}</span>
              {answered && idx === correctAnswer && (
                <span className="ml-auto text-sf-emerald text-sm">✓ Correct</span>
              )}
              {answered && idx === selectedAnswer && idx !== correctAnswer && (
                <span className="ml-auto text-sf-rose text-sm">✗ Wrong</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-sf-blue/5 border border-sf-blue/20"
        >
          <p className="text-sm text-sf-text-secondary">
            <span className="font-semibold text-sf-blue">Explanation: </span>
            {question.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
