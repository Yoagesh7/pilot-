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
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left section: Mobile menu toggle + Org switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <OrgSwitcher />
      </div>

      {/* Middle: Command Palette Search Bar Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearchModal}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search contracts, clauses, or AI recommendations...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Section: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearchModal}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h4>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                      2 new
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs flex gap-2 transition-colors ${
                          n.unread ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
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
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {user?.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40"
                >
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      <Shield className="w-3 h-3" />
                      {user?.role}
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
