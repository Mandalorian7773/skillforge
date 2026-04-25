// ===== Match Types =====

export type MatchStatus = 'waiting' | 'in_progress' | 'completed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionCategory = 'logic' | 'math' | 'pattern' | 'code';

export interface Match {
  id: string;
  creator: string;
  entryFee: number;
  maxPlayers: number;
  players: Player[];
  status: MatchStatus;
  winner: string | null;
  poolAmount: number;
  platformFee: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  currentQuestion: number;
  totalQuestions: number;
}

export interface Player {
  address: string;
  displayName: string;
  score: number;
  answeredQuestions: number;
  joinedAt: string;
}

// ===== Challenge Types =====

export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  codeSnippet?: string;
  explanation?: string;
}

export interface ChallengeState {
  matchId: string;
  questions: Question[];
  currentQuestionIndex: number;
  scores: Record<string, number>;
  timeRemaining: number;
  isFinished: boolean;
}

export interface SubmitAnswerRequest {
  matchId: string;
  questionId: string;
  answerIndex: number;
  playerAddress: string;
  timeTaken: number;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  correctAnswer: number;
  scoreAwarded: number;
  totalScore: number;
  explanation?: string;
}

// ===== Leaderboard Types =====

export interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  totalEarnings: number;
  matchesPlayed: number;
  matchesWon: number;
  winRate: number;
  bestStreak: number;
}

// ===== User Types =====

export interface UserStats {
  address: string;
  totalEarnings: number;
  matchesPlayed: number;
  matchesWon: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  averageScore: number;
  difficulty: Difficulty;
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// ===== Create Match Types =====

export interface CreateMatchRequest {
  creatorAddress: string;
  entryFee: number;
  maxPlayers: number;
}

export interface JoinMatchRequest {
  playerAddress: string;
}
