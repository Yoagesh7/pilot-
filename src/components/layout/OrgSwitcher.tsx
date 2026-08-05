import React, { useState } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const ORGANIZATIONS = [
  'Acme Global Legal Ops',
  'Apex Capital Legal Team',
  'CloudScale Enterprise Legal',
];

export const OrgSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrganization, setOrganization } = useAuthStore();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors border border-slate-200/60 dark:border-slate-700/60"
      >
        <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span className="max-w-[140px] truncate">{activeOrganization}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-0 mt-2 w-56 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40"
            >
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Organization
              </div>
              {ORGANIZATIONS.map((org) => {
                const isSelected = org === activeOrganization;
                return (
                  <button
                    key={org}
                    onClick={() => {
                      setOrganization(org);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="truncate">{org}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
