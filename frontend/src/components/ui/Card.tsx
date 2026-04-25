import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hoverable = true,
  gradient = false,
  onClick,
}: CardProps) {
  const baseClass = hoverable ? 'sf-card' : 'sf-card-static';
  const gradientClass = gradient ? 'sf-gradient-border' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClass} ${gradientClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'purple' | 'cyan' | 'emerald' | 'amber';
  trend?: { value: number; positive: boolean };
}

export function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <div className={`sf-card sf-stat-card ${color} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-sf-text-secondary mb-1">{label}</p>
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${
                trend.positive ? 'text-sf-emerald' : 'text-sf-rose'
              }`}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-sf-text-muted">vs last week</span>
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${
            color === 'purple'
              ? 'from-sf-purple/20 to-sf-purple/5'
              : color === 'cyan'
              ? 'from-sf-cyan/20 to-sf-cyan/5'
              : color === 'emerald'
              ? 'from-sf-emerald/20 to-sf-emerald/5'
              : 'from-amber-500/20 to-amber-500/5'
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
