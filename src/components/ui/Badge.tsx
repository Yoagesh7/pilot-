import React from 'react';
import { clsx } from 'clsx';
import { RiskLevel } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'risk';
  riskLevel?: RiskLevel;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  riskLevel,
  size = 'md',
  children,
  ...props
}) => {
  let resolvedVariant = variant;
  if (riskLevel) {
    resolvedVariant = riskLevel === 'High' ? 'danger' : riskLevel === 'Medium' ? 'warning' : 'success';
  }

  const base = 'inline-flex items-center font-medium rounded-full transition-colors';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    info: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
    risk: '',
  };

  return (
    <span
      className={clsx(base, sizeClasses, variants[resolvedVariant], className)}
      {...props}
    >
      {riskLevel && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse',
            riskLevel === 'High' ? 'bg-rose-500' : riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
          )}
        />
      )}
      {children || riskLevel}
    </span>
  );
};
