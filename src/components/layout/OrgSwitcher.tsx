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
  const [selectedOrg, setSelectedOrg] = useState('Acme Global Legal Ops');
  const { user } = useAuthStore();

  const activeOrg = user?.organization || selectedOrg;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-none bg-[#EFECE6] dark:bg-[#181818] hover:bg-[#E7E4DC] dark:hover:bg-[#222222] text-xs font-bold text-[#18181B] dark:text-slate-100 transition-colors border border-[#E0DDD5] dark:border-[#27272A] shadow-2xs"
      >
        <Building2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
        <span className="max-w-[150px] truncate">{activeOrg}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-0 mt-2 w-60 p-1.5 bg-white dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] rounded-none shadow-xl z-40"
            >
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Select Legal Workspace
              </div>
              {ORGANIZATIONS.map((org) => {
                const isSelected = org === activeOrg;
                return (
                  <button
                    key={org}
                    onClick={() => {
                      setSelectedOrg(org);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-none text-left text-slate-800 dark:text-slate-200 hover:bg-[#FAF9F5] dark:hover:bg-[#1F1F1F] transition-colors"
                  >
                    <span className="truncate">{org}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#18181B] dark:text-white shrink-0 ml-2" />}
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
