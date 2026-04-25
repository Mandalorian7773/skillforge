import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type {
  Match,
  CreateMatchRequest,
  JoinMatchRequest,
  Question,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  LeaderboardEntry,
  UserStats,
  ApiResponse,
} from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ===== Match API =====

export async function getMatches(): Promise<Match[]> {
  const { data } = await api.get<ApiResponse<Match[]>>('/matches');
  return data.data;
}

export async function getMatch(matchId: string): Promise<Match> {
  const { data } = await api.get<ApiResponse<Match>>(`/matches/${matchId}`);
  return data.data;
}

export async function createMatch(req: CreateMatchRequest): Promise<Match> {
  const { data } = await api.post<ApiResponse<Match>>('/matches', req);
  return data.data;
}

export async function joinMatch(matchId: string, req: JoinMatchRequest): Promise<Match> {
  const { data } = await api.post<ApiResponse<Match>>(`/matches/${matchId}/join`, req);
  return data.data;
}

// ===== Challenge API =====

export async function getQuestions(matchId: string): Promise<Question[]> {
  const { data } = await api.get<ApiResponse<Question[]>>(`/challenges/${matchId}/questions`);
  return data.data;
}

export async function submitAnswer(req: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
  const { data } = await api.post<ApiResponse<SubmitAnswerResponse>>(
    `/challenges/${req.matchId}/submit`,
    req
  );
  return data.data;
}

export async function completeMatch(matchId: string, playerAddress?: string): Promise<Match> {
  const { data } = await api.post<ApiResponse<Match>>(`/matches/${matchId}/complete`, { playerAddress });
  return data.data;
}

// ===== Leaderboard API =====

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await api.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard');
  return data.data;
}

// ===== User API =====

export async function getUserStats(address: string): Promise<UserStats> {
  const { data } = await api.get<ApiResponse<UserStats>>(`/users/${address}/stats`);
  return data.data;
}

export default api;
