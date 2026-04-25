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
  questions?: string[]; // question IDs
}

export interface Player {
  address: string;
  displayName: string;
  score: number;
  answeredQuestions: number;
  joinedAt: string;
}

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
