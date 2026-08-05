import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'md',
}) => {
  const widths = {
    md: 'w-80 sm:w-96',
    lg: 'w-96 sm:w-[480px]',
    xl: 'w-full sm:w-[600px]',
  };

  const initialX = position === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs"
          />

          <div
            className={clsx(
              'fixed inset-y-0 flex max-w-full',
              position === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <motion.div
              initial={{ x: initialX }}
              animate={{ x: 0 }}
              exit={{ x: initialX }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={clsx(
                'relative bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col',
                widths[width]
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
