/**
 * Truncate a blockchain address for display
 */
export function truncateAddress(address: string, chars = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a number as currency (INIT token)
 */
export function formatTokenAmount(amount: number, decimals = 2): string {
  return `${amount.toFixed(decimals)} INIT`;
}

/**
 * Format a large number with K/M suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Format time remaining in seconds to mm:ss
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

/**
 * Generate a display name from an address
 */
export function generateDisplayName(address: string): string {
  if (!address) return 'Anonymous';
  return `Player_${address.slice(-4).toUpperCase()}`;
}

/**
 * Calculate reward after platform fee
 */
export function calculateReward(poolAmount: number, feePercent = 5): number {
  return poolAmount * (1 - feePercent / 100);
}

/**
 * Get relative time string
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Create confetti particles
 */
export function createConfetti(count = 50): void {
  const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];
  
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sf-confetti-piece';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = `${Math.random() * 2}s`;
    el.style.animationDuration = `${2 + Math.random() * 2}s`;
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${6 + Math.random() * 8}px`;
    document.body.appendChild(el);
    
    setTimeout(() => el.remove(), 5000);
  }
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
