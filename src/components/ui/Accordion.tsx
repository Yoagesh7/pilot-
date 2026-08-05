import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  badge?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  className,
}) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={clsx('divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="transition-colors">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
            >
              <div className="flex items-center gap-3 pr-4">
                {item.title}
                {item.badge}
              </div>
              <ChevronDown
                className={clsx(
                  'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
                  isOpen && 'rotate-180 text-blue-600'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <div className="p-4 sm:p-5 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
