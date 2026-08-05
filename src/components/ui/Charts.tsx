import React from 'react';
import { motion } from 'framer-motion';

import { Document } from '@/types';

interface RiskDistributionChartProps {
  documents?: Document[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ documents = [] }) => {
  const total = documents.length || 1;
  const lowCount = documents.filter((d) => d.riskScore === 'Low').length;
  const medCount = documents.filter((d) => d.riskScore === 'Medium').length;
  const highCount = documents.filter((d) => d.riskScore === 'High').length;

  const data = documents.length > 0
    ? [
        { label: 'Low Risk', count: lowCount, color: '#18181B', percentage: Math.round((lowCount / total) * 100) },
        { label: 'Medium Risk', count: medCount, color: '#52525B', percentage: Math.round((medCount / total) * 100) },
        { label: 'High Risk', count: highCount, color: '#A1A1AA', percentage: Math.round((highCount / total) * 100) },
      ]
    : [
        { label: 'Low Risk', count: 18, color: '#18181B', percentage: 55 },
        { label: 'Medium Risk', count: 10, color: '#52525B', percentage: 30 },
        { label: 'High Risk', count: 5, color: '#A1A1AA', percentage: 15 },
      ];

  return (
    <div className="space-y-6 pt-2">
      {/* Segmented dark bar matching screenshot */}
      <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#EAE8E1] dark:bg-[#1A1A1A] p-0.5 gap-1">
        {data.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(item.percentage, 2)}%` }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            style={{ backgroundColor: item.color }}
            className="h-full rounded-full transition-all"
            title={`${item.label}: ${item.count} documents (${item.percentage}%)`}
          />
        ))}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#F4F2EC] dark:bg-[#1A1A1A] border border-[#E4E1D8] dark:border-[#27272A]"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <div className="text-sm font-bold font-serif text-[#18181B] dark:text-slate-100 mt-1">
              {item.count} <span className="text-[11px] font-sans font-normal text-slate-500">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MonthlyUploadChart: React.FC = () => {
  const months = [
    { name: 'MAR', count: 14 },
    { name: 'APR', count: 22 },
    { name: 'MAY', count: 19 },
    { name: 'JUN', count: 42 },
    { name: 'JUL', count: 54 },
    { name: 'AUG', count: 54 },
  ];

  const max = Math.max(...months.map((m) => m.count));

  return (
    <div className="flex items-end justify-between gap-3 h-44 pt-4">
      {months.map((m, idx) => {
        const heightPercent = (m.count / max) * 100;
        return (
          <div key={m.name} className="flex-1 flex flex-col items-center h-full justify-end group">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${heightPercent}%` }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="w-full rounded-t-lg bg-[#444444] dark:bg-[#A0A0A0] group-hover:bg-[#18181B] dark:group-hover:bg-white transition-all cursor-pointer"
            />
            <span className="text-[10px] tracking-wider text-slate-500 dark:text-slate-400 font-bold uppercase mt-3">
              {m.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
