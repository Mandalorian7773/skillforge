// ===== API Constants =====
export const API_BASE_URL = '/api';

// ===== Blockchain Constants =====
// InterwovenKit wallet provider chain — must exist in Initia's public registry
export const INITIA_CHAIN_ID = 'initiation-2';
// Local rollup chain — used for contract calls when running local node
export const SKILLFORGE_CHAIN_ID = 'skillforge-1';
export const INITIA_RPC_URL = 'http://localhost:26657';
export const INITIA_REST_URL = 'http://localhost:1317';
export const INITIA_DENOM = 'umin';
export const INITIA_DECIMALS = 6;
export const INITIA_EXPLORER_URL = 'https://scan.testnet.initia.xyz';
export const SKILLFORGE_CONTRACT_ADDRESS: string = 'init1f99fdlqsfatgtdgvkmvwqte5c7eym32r846ksj';
export const PLATFORM_FEE_PERCENT = 5;
export const MIN_ENTRY_FEE = 0.1;
export const MAX_ENTRY_FEE = 100;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 5;

// ===== Game Constants =====
export const QUESTIONS_PER_MATCH = 5;
export const DEFAULT_TIME_LIMIT = 30; // seconds
export const SCORE_PER_CORRECT = 100;
export const TIME_BONUS_MULTIPLIER = 2; // bonus points per second remaining

// ===== UI Constants =====
export const POLL_INTERVAL_MS = 2000;
export const TOAST_DURATION_MS = 4000;

// ===== Match Status Labels =====
export const STATUS_LABELS: Record<string, string> = {
  waiting: 'Waiting for Players',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const STATUS_COLORS: Record<string, string> = {
  waiting: 'sf-badge-waiting',
  in_progress: 'sf-badge-live',
  completed: 'sf-badge-completed',
};

// ===== Confetti Colors =====
export const CONFETTI_COLORS = [
  '#7c3aed', '#06b6d4', '#10b981', '#f59e0b',
  '#f43f5e', '#3b82f6', '#a78bfa', '#67e8f9',
];
