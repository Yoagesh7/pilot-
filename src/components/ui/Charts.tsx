import React from 'react';
import { motion } from 'framer-motion';

export const RiskDistributionChart: React.FC = () => {
  const data = [
    { label: 'Low Risk', count: 18, color: '#10B981', percentage: 55 },
    { label: 'Medium Risk', count: 10, color: '#F59E0B', percentage: 30 },
    { label: 'High Risk', count: 5, color: '#EF4444', percentage: 15 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 p-0.5">
        {data.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ width: 0 }}
            animate={{ width: `${item.percentage}%` }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            style={{ backgroundColor: item.color }}
            className="h-full rounded-full transition-all first:rounded-l-full last:rounded-r-full"
            title={`${item.label}: ${item.count} documents`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {item.count} <span className="text-xs font-normal text-slate-400">({item.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MonthlyUploadChart: React.FC = () => {
  const months = [
    { name: 'Mar', count: 14 },
    { name: 'Apr', count: 22 },
    { name: 'May', count: 19 },
    { name: 'Jun', count: 35 },
    { name: 'Jul', count: 48 },
    { name: 'Aug', count: 62 },
  ];

  const max = Math.max(...months.map((m) => m.count));

  return (
    <div className="flex items-end justify-between gap-3 h-40 pt-4">
      {months.map((m, idx) => {
        const heightPercent = (m.count / max) * 100;
        return (
          <div key={m.name} className="flex-1 flex flex-col items-center h-full justify-end group">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
              {m.count}
            </span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${heightPercent}%` }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 group-hover:brightness-110 transition-all cursor-pointer shadow-xs"
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
              {m.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
