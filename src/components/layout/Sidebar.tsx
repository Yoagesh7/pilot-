'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  MessageSquare,
  Search,
  BarChart3,
  Users,
  Settings,
  X,
  Upload,
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenUploadModal: () => void;
}

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'AI Analysis', href: '/analysis', icon: Sparkles, badge: 'AI' },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onCloseMobile,
  onOpenUploadModal,
}) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FAF9F5] dark:bg-[#0A0A0A] border-r border-[#E6E4DF] dark:border-[#27272A] transition-colors">
      {/* Brand Logo & Header matching image */}
      <div className="h-20 flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-none bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] shadow-2xs">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16" />
              <path d="M6 16l6-12 6 12" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight font-serif text-[#18181B] dark:text-slate-100 uppercase">
              LEGALOS
            </span>
            <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 -mt-0.5">
              Legal AI Platform
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-none text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Upload CTA - Solid Dark Pill Button */}
      <div className="px-5 mb-3">
        <button
          onClick={() => {
            onOpenUploadModal();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-none bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#18181B] text-xs font-bold tracking-wide shadow-2xs active:scale-[0.98] transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Contract</span>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={clsx(
                'group relative flex items-center gap-3 px-3.5 py-2.5 rounded-none text-xs font-semibold transition-all duration-150 select-none',
                isActive
                  ? 'bg-[#EAE8E1] dark:bg-[#1F1F1F] text-[#18181B] dark:text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#18181B] dark:hover:text-slate-100 hover:bg-[#F2F0EA] dark:hover:bg-[#181818]'
              )}
            >
              <Icon
                className={clsx(
                  'w-4 h-4 transition-colors',
                  isActive
                    ? 'text-[#18181B] dark:text-white'
                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                )}
              />
              <span className="flex-1">{item.name}</span>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-none bg-[#E2DFD7] dark:bg-[#27272A] text-slate-700 dark:text-slate-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Webhook Status Indicator Banner */}
      <div className="p-4 m-4 rounded-none bg-[#F0EEE8] dark:bg-[#141414] border border-[#E4E1D9] dark:border-[#27272A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-[#18181B] dark:text-slate-200">
            SNS Webhook Active
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
          http://localhost:8000/api listening for direct payloads.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-64 h-full z-10"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
