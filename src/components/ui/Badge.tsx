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

  const base = 'inline-flex items-center font-bold tracking-wide rounded-none transition-colors';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variants = {
    default: 'bg-[#EFECE6] dark:bg-[#1C1C1C] text-slate-800 dark:text-slate-200 border border-[#E2DFD6] dark:border-[#27272A]',
    primary: 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60',
    info: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
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
            'w-1.5 h-1.5 rounded-full mr-1.5',
            riskLevel === 'High' ? 'bg-rose-500' : riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
          )}
        />
      )}
      {children || riskLevel}
    </span>
  );
};
