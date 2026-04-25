import { Router } from 'express';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  joinMatch,
  completeMatch,
  submitScore,
  getUserStatsFor,
  getLeaderboard,
} from '../services/matchService.js';
import { getRandomQuestions, QUESTION_POOL } from '../data/questions.js';

const router = Router();

// ===== MATCH ROUTES =====

// GET /api/matches - List all matches
router.get('/matches', (_req, res) => {
  try {
    const matches = getAllMatches();
    // Strip question answers before sending
    const sanitized = matches.map((m) => ({ ...m, questions: undefined }));
    res.json({ success: true, data: sanitized });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/matches/:id - Get match details
router.get('/matches/:id', (req, res) => {
  try {
    const match = getMatchById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    res.json({ success: true, data: { ...match, questions: undefined } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/matches - Create a match
router.post('/matches', (req, res) => {
  try {
    const { creatorAddress, entryFee, maxPlayers } = req.body;
    if (!creatorAddress) {
      return res.status(400).json({ success: false, error: 'creatorAddress required' });
    }

    // Fix 10: Strict entry fee validation — no silent defaults
    if (entryFee === undefined || entryFee === null || typeof entryFee !== 'number' || isNaN(entryFee)) {
      return res.status(400).json({ success: false, error: 'entryFee must be a valid number' });
    }
    if (entryFee < 0.1 || entryFee > 100) {
      return res.status(400).json({ success: false, error: 'entryFee must be between 0.1 and 100' });
    }

    // Validate maxPlayers
    const players = maxPlayers || 2;
    if (typeof players !== 'number' || players < 2 || players > 5) {
      return res.status(400).json({ success: false, error: 'maxPlayers must be between 2 and 5' });
    }

    const match = createMatch(creatorAddress, entryFee, players);
    res.status(201).json({ success: true, data: match });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/matches/:id/join - Join a match
router.post('/matches/:id/join', (req, res) => {
  try {
    const { playerAddress } = req.body;
    if (!playerAddress) {
      return res.status(400).json({ success: false, error: 'playerAddress required' });
    }
    const match = joinMatch(req.params.id, playerAddress);
    res.json({ success: true, data: match });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/matches/:id/complete - Complete a match
router.post('/matches/:id/complete', (req, res) => {
  try {
    const { playerAddress } = req.body;
    // Fix 11: Pass playerAddress for authorization
    const match = completeMatch(req.params.id, playerAddress);
    res.json({ success: true, data: match });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ===== CHALLENGE ROUTES =====

// GET /api/challenges/:matchId/questions - Get questions for a match
router.get('/challenges/:matchId/questions', (req, res) => {
  try {
    // Fix 4: Return 404 if match does not exist
    const match = getMatchById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    if (match.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Match is not in progress' });
    }

    const questions = getRandomQuestions(5);

    // Fix 3: Strip correct answers AND explanation before sending — prevent answer leak
    const sanitized = questions.map(({ correctAnswer, explanation, ...q }) => q);
    res.json({ success: true, data: sanitized });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/challenges/:matchId/submit - Submit an answer
router.post('/challenges/:matchId/submit', (req, res) => {
  try {
    const { questionId, answerIndex, playerAddress, timeTaken } = req.body;

    // Fix 4 & 5: Validate match exists and player is valid
    const match = getMatchById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    if (match.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Match is not in progress' });
    }
    if (!playerAddress) {
      return res.status(400).json({ success: false, error: 'playerAddress required' });
    }
    if (!match.players.some((p) => p.address === playerAddress)) {
      return res.status(403).json({ success: false, error: 'Player not in this match' });
    }

    // Find question in pool
    const question = QUESTION_POOL.find((q) => q.id === questionId);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    const correct = answerIndex === question.correctAnswer;
    const timeBonus = correct ? Math.max(0, Math.floor((question.timeLimit - (timeTaken || 0)) * 2)) : 0;
    const scoreAwarded = correct ? 100 + timeBonus : 0;

    // Update match score — errors should propagate, not be silently swallowed
    const result = submitScore(req.params.matchId, playerAddress, questionId, answerIndex, timeTaken || 0);

    res.json({
      success: true,
      data: {
        correct,
        correctAnswer: question.correctAnswer,
        scoreAwarded,
        totalScore: result.totalScore,
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ===== LEADERBOARD ROUTES =====

router.get('/leaderboard', (_req, res) => {
  try {
    const entries = getLeaderboard();
    res.json({ success: true, data: entries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== USER ROUTES =====

router.get('/users/:address/stats', (req, res) => {
  try {
    const stats = getUserStatsFor(req.params.address);
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
