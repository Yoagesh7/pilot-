import React from 'react';
import { clsx } from 'clsx';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  className,
  barClassName,
  showLabel = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx('w-full flex items-center gap-3', className)}>
      <div className="relative flex-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={clsx(
            'h-full bg-blue-600 transition-all duration-300 ease-out rounded-full',
            barClassName
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-9 text-right">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
};
