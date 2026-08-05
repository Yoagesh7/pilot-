import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverLift = false,
  glass = false,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-200 border',
        glass
          ? 'glass-panel'
          : 'bg-white dark:bg-[#141414] border-[#E6E4DF] dark:border-[#27272A] shadow-2xs',
        hoverLift && 'legalos-card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={clsx('flex flex-col gap-1 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={clsx('text-xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={clsx('text-xs text-slate-500 dark:text-slate-400 font-medium', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={clsx('pt-0', className)} {...props}>
    {children}
  </div>
);
