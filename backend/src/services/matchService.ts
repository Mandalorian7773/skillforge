import { v4 as uuidv4 } from 'uuid';
import type { Match, Player } from '../types/index.js';
import { getRandomQuestions } from '../data/questions.js';

const PLATFORM_FEE_PERCENT = 5;
const QUESTIONS_PER_MATCH = 5;

// In-memory store (production would use a database)
const matches = new Map<string, Match>();
const userStats = new Map<string, {
  totalEarnings: number;
  matchesPlayed: number;
  matchesWon: number;
  scores: number[];
}>();

export function getAllMatches(): Match[] {
  return Array.from(matches.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getMatchById(id: string): Match | undefined {
  return matches.get(id);
}

export function createMatch(creatorAddress: string, entryFee: number, maxPlayers: number): Match {
  const id = uuidv4();
  const player: Player = {
    address: creatorAddress,
    displayName: `Player_${creatorAddress.slice(-4).toUpperCase()}`,
    score: 0,
    answeredQuestions: 0,
    joinedAt: new Date().toISOString(),
  };

  const match: Match = {
    id,
    creator: creatorAddress,
    entryFee,
    maxPlayers: Math.min(Math.max(maxPlayers, 2), 5),
    players: [player],
    status: 'waiting',
    winner: null,
    poolAmount: entryFee,
    platformFee: 0,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    currentQuestion: 0,
    totalQuestions: QUESTIONS_PER_MATCH,
    questions: [],
  };

  matches.set(id, match);
  return match;
}

export function joinMatch(matchId: string, playerAddress: string): Match {
  const match = matches.get(matchId);
  if (!match) throw new Error('Match not found');
  if (match.status !== 'waiting') throw new Error('Match already started');
  if (match.players.length >= match.maxPlayers) throw new Error('Match is full');
  if (match.players.some((p) => p.address === playerAddress)) throw new Error('Already joined');

  const player: Player = {
    address: playerAddress,
    displayName: `Player_${playerAddress.slice(-4).toUpperCase()}`,
    score: 0,
    answeredQuestions: 0,
    joinedAt: new Date().toISOString(),
  };

  match.players.push(player);
  match.poolAmount = match.entryFee * match.players.length;

  // Auto-start if full
  if (match.players.length >= match.maxPlayers) {
    startMatch(matchId);
  }

  return match;
}

export function startMatch(matchId: string): Match {
  const match = matches.get(matchId);
  if (!match) throw new Error('Match not found');

  // Determine difficulty based on average player level
  const avgDifficulty = getDifficultyForMatch(match);
  const questions = getRandomQuestions(QUESTIONS_PER_MATCH, avgDifficulty);

  match.status = 'in_progress';
  match.startedAt = new Date().toISOString();
  match.questions = questions.map((q) => q.id);

  return match;
}

export function submitScore(matchId: string, playerAddress: string, questionId: string, answerIndex: number, timeTaken: number) {
  const match = matches.get(matchId);
  if (!match) throw new Error('Match not found');
  if (match.status !== 'in_progress') throw new Error('Match is not in progress');

  const player = match.players.find((p) => p.address === playerAddress);
  if (!player) throw new Error('Player not in match');

  const questions = getRandomQuestions(30); // get full pool
  const question = questions.find((q) => q.id === questionId);
  if (!question) throw new Error('Question not found');

  const correct = answerIndex === question.correctAnswer;
  const timeBonus = correct ? Math.max(0, Math.floor((question.timeLimit - timeTaken) * 2)) : 0;
  const scoreAwarded = correct ? 100 + timeBonus : 0;

  player.score += scoreAwarded;
  player.answeredQuestions += 1;

  return {
    correct,
    correctAnswer: question.correctAnswer,
    scoreAwarded,
    totalScore: player.score,
    explanation: question.explanation,
  };
}

// Fix 11: completeMatch now validates authorization and match state
export function completeMatch(matchId: string, playerAddress?: string): Match {
  const match = matches.get(matchId);
  if (!match) throw new Error('Match not found');

  // Validate match status — must be in_progress
  if (match.status === 'completed') throw new Error('Match is already completed');
  if (match.status === 'waiting') throw new Error('Match has not started yet');

  // Validate caller is a player in the match (if playerAddress provided)
  if (playerAddress) {
    const isPlayer = match.players.some((p) => p.address === playerAddress);
    if (!isPlayer) throw new Error('Not authorized: you are not a player in this match');
  }

  // Find winner (highest score)
  let winner = match.players[0];
  for (const player of match.players) {
    if (player.score > winner.score) {
      winner = player;
    }
  }

  match.status = 'completed';
  match.winner = winner.address;
  match.platformFee = match.poolAmount * (PLATFORM_FEE_PERCENT / 100);
  match.completedAt = new Date().toISOString();

  // Update user stats
  for (const player of match.players) {
    const stats = userStats.get(player.address) || {
      totalEarnings: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      scores: [],
    };
    stats.matchesPlayed += 1;
    stats.scores.push(player.score);
    if (player.address === winner.address) {
      stats.matchesWon += 1;
      stats.totalEarnings += match.poolAmount - match.platformFee;
    }
    userStats.set(player.address, stats);
  }

  return match;
}

export function getUserStatsFor(address: string) {
  const stats = userStats.get(address);
  if (!stats) {
    return {
      address,
      totalEarnings: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      winRate: 0,
      currentStreak: 0,
      bestStreak: 0,
      averageScore: 0,
      difficulty: 'medium' as const,
    };
  }

  const winRate = stats.matchesPlayed > 0
    ? Math.round((stats.matchesWon / stats.matchesPlayed) * 100)
    : 0;
  const avgScore = stats.scores.length > 0
    ? Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length)
    : 0;

  return {
    address,
    totalEarnings: stats.totalEarnings,
    matchesPlayed: stats.matchesPlayed,
    matchesWon: stats.matchesWon,
    winRate,
    currentStreak: 0,
    bestStreak: 0,
    averageScore: avgScore,
    difficulty: getDifficultyForUser(stats.scores) as 'easy' | 'medium' | 'hard',
  };
}

export function getLeaderboard() {
  const entries = Array.from(userStats.entries())
    .map(([address, stats]) => ({
      address,
      displayName: `Player_${address.slice(-4).toUpperCase()}`,
      totalEarnings: stats.totalEarnings,
      matchesPlayed: stats.matchesPlayed,
      matchesWon: stats.matchesWon,
      winRate: stats.matchesPlayed > 0
        ? Math.round((stats.matchesWon / stats.matchesPlayed) * 100)
        : 0,
      bestStreak: 0,
    }))
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return entries;
}

// ===== AI Difficulty Engine =====

function getDifficultyForUser(scores: number[]): string {
  if (scores.length < 3) return 'medium';
  const recent = scores.slice(-10);
  const avgPercent = (recent.reduce((a, b) => a + b, 0) / recent.length) / 500 * 100;

  if (avgPercent > 80) return 'hard';
  if (avgPercent < 40) return 'easy';
  return 'medium';
}

function getDifficultyForMatch(match: Match): string {
  const difficulties = match.players.map((p) => {
    const stats = userStats.get(p.address);
    if (!stats) return 'medium';
    return getDifficultyForUser(stats.scores);
  });

  // Use the most common difficulty
  const counts: Record<string, number> = {};
  for (const d of difficulties) {
    counts[d] = (counts[d] || 0) + 1;
  }

  let maxDifficulty = 'medium';
  let maxCount = 0;
  for (const [d, c] of Object.entries(counts)) {
    if (c > maxCount) {
      maxDifficulty = d;
      maxCount = c;
    }
  }

  return maxDifficulty;
}
