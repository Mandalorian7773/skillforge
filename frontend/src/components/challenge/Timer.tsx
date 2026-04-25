import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

export default function Timer({ timeRemaining, totalTime }: TimerProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = timeRemaining / totalTime;
  const dashOffset = circumference * (1 - progress);

  const isWarning = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  const color = isCritical
    ? '#f43f5e'
    : isWarning
    ? '#f59e0b'
    : '#7c3aed';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="sf-timer-ring"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(124, 58, 237, 0.1)"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: isCritical ? `drop-shadow(0 0 8px ${color})` : 'none',
          }}
        />
      </svg>
      <motion.div
        className="absolute text-center"
        animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <span
          className="text-2xl font-bold"
          style={{
            fontFamily: 'var(--font-heading)',
            color,
          }}
        >
          {timeRemaining}
        </span>
        <p className="text-[10px] text-sf-text-muted">SEC</p>
      </motion.div>
    </div>
  );
}
