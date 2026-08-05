import React from 'react';
import { clsx } from 'clsx';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  return (
    <div
      className={clsx(
        variant === 'underline'
          ? 'border-b border-slate-200 dark:border-slate-800 flex gap-6 overflow-x-auto scrollbar-none'
          : 'flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl gap-1 overflow-x-auto',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 text-sm font-medium transition-all duration-200 whitespace-nowrap select-none',
              variant === 'underline'
                ? clsx(
                    'pb-3 pt-1 border-b-2',
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  )
                : clsx(
                    'px-4 py-2 rounded-lg',
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  )
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'px-1.5 py-0.5 text-[10px] rounded-full font-bold',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
