import React from 'react';
import { clsx } from 'clsx';
import { FileText, ShieldAlert, CheckCircle, Sparkles, UserCheck } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'upload' | 'analysis' | 'risk' | 'export' | 'user';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  const getIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'upload':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'analysis':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      case 'risk':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'export':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <UserCheck className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className={clsx('relative space-y-6 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800', className)}>
      {items.map((item) => (
        <div key={item.id} className="relative flex items-start gap-4 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs z-10 group-hover:border-blue-500 transition-colors">
            {getIcon(item.type)}
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h4>
              <time className="text-xs text-slate-400 font-medium">{item.timestamp}</time>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
