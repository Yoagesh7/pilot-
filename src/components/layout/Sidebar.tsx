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
  Scale,
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
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Brand Logo & Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              LEGAL<span className="text-blue-600 dark:text-blue-400">OS</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 -mt-1">
              Legal AI Platform
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Upload CTA */}
      <div className="p-4">
        <button
          onClick={() => {
            onOpenUploadModal();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Contract</span>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={clsx(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              )}
            >
              {/* Active Indicator Pillar */}
              {isActive && (
                <motion.div
                  layoutId="activePillar"
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={clsx(
                  'w-4 h-4 transition-colors',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                )}
              />
              <span className="flex-1">{item.name}</span>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Webhook Status Indicator Banner */}
      <div className="p-4 m-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            SNS Webhook Active
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          `http://localhost:8000/api` listening for contract payloads.
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
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
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
