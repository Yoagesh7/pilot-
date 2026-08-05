'use client';

import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, LogOut, Shield, ChevronDown, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { OrgSwitcher } from './OrgSwitcher';
import { Avatar } from '@/components/ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onOpenSearchModal,
}) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: '1', text: 'SNS Workbench Webhook processed CloudScale SaaS Agreement', time: '5m ago', unread: true },
    { id: '2', text: 'Sarah Jenkins requested redline on Section 11.2', time: '1h ago', unread: true },
    { id: '3', text: 'GDPR Compliance Report generation completed', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FAF9F5]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#E6E4DF] dark:border-[#27272A] px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left section: Mobile menu toggle + Org switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1C1C1C] lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <OrgSwitcher />
      </div>

      {/* Middle: Command Palette Search Bar Trigger */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <button
          onClick={onOpenSearchModal}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#EFECE6]/80 dark:bg-[#181818] border border-[#E2DFD7] dark:border-[#27272A] text-slate-500 hover:text-[#18181B] dark:hover:text-slate-200 text-xs transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search contracts, clauses, or AI re...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-[#141414] rounded-md border border-[#E0DDD5] dark:border-[#27272A] text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Section: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearchModal}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1C1C1C] md:hidden transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-[#18181B] dark:text-slate-400 dark:hover:text-slate-100 hover:bg-[#F0EEE8] dark:hover:bg-[#1C1C1C] transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell matching image */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-[#18181B] dark:text-slate-400 dark:hover:text-slate-100 hover:bg-[#F0EEE8] dark:hover:bg-[#1C1C1C] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 p-2 bg-white dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] rounded-2xl shadow-xl z-40"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-[#27272A]">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                    <span className="text-[11px] font-bold text-[#18181B] dark:text-slate-200 bg-[#F0EEE8] dark:bg-[#1C1C1C] px-2 py-0.5 rounded-full">
                      2 new
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-[#27272A] max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs flex gap-2 transition-colors ${
                          n.unread ? 'bg-[#FAF9F5] dark:bg-[#1C1C1C]' : 'hover:bg-slate-50 dark:hover:bg-[#1C1C1C]/50'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{n.text}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#F0EEE8] dark:hover:bg-[#1C1C1C] transition-colors"
          >
            <Avatar name={user?.name || 'Sarah Jenkins'} src={user?.avatar} size="sm" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#18181B] dark:text-slate-100 leading-tight">
                {user?.name || 'Sarah Jenkins'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {user?.role || 'Senior Counsel'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] rounded-2xl shadow-xl z-40"
                >
                  <div className="p-3 border-b border-slate-100 dark:border-[#27272A]">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.name || 'Sarah Jenkins'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || 'sarah.jenkins@acmelegal.com'}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F0EEE8] dark:bg-[#1C1C1C] text-slate-800 dark:text-slate-200">
                      <Shield className="w-3 h-3" />
                      {user?.role || 'Senior Counsel'}
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1C1C1C] transition-colors"
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
