import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#18181B]/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-[#18181B] hover:bg-black text-white shadow-2xs dark:bg-white dark:hover:bg-slate-100 dark:text-[#18181B]',
      secondary:
        'bg-[#EFECE6] hover:bg-[#E7E4DC] text-[#18181B] dark:bg-[#1C1E26] dark:hover:bg-[#252833] dark:text-slate-100 border border-[#E2DFD6] dark:border-[#2A2D3C]',
      outline:
        'border border-[#E2DFD6] dark:border-[#2A2D3C] bg-white dark:bg-[#16171D] hover:bg-[#FAF9F5] dark:hover:bg-[#1E202A] text-[#18181B] dark:text-slate-200 shadow-2xs',
      ghost:
        'bg-transparent hover:bg-[#F0EEE8] dark:hover:bg-[#1C1E26] text-slate-700 dark:text-slate-300',
      destructive:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs',
      glass:
        'bg-white/80 dark:bg-[#181922]/80 backdrop-blur-md hover:bg-white dark:hover:bg-[#1F212C] text-[#18181B] dark:text-slate-100 shadow-2xs border border-[#E2DFD6] dark:border-[#2A2D3C]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-2 gap-1.5',
      md: 'text-xs px-4 py-2.5 gap-2',
      lg: 'text-sm px-5 py-3 gap-2.5',
      icon: 'p-2 w-9 h-9',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
