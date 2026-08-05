'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Lock, Mail, User, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Senior Counsel');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { initAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await authService.register(email, password, fullName || 'Legal Counsel', role);
      await initAuth();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[RegisterPage] Registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF9F5] dark:bg-[#0A0A0A] text-[#18181B] dark:text-slate-100 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] rounded-3xl p-8 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] shadow-md mb-2">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif tracking-tight text-[#18181B] dark:text-white">
            Create LEGALOS Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Multi-Tenant Enterprise Legal AI Platform
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] dark:bg-[#1C1C1C] border border-[#E2DFD6] dark:border-[#27272A] rounded-xl text-xs text-[#18181B] dark:text-slate-100 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="s.jenkins@enterprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] dark:bg-[#1C1C1C] border border-[#E2DFD6] dark:border-[#27272A] rounded-xl text-xs text-[#18181B] dark:text-slate-100 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Legal Role</label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] dark:bg-[#1C1C1C] border border-[#E2DFD6] dark:border-[#27272A] rounded-xl text-xs text-[#18181B] dark:text-slate-100 font-bold focus:outline-none"
              >
                <option value="Senior Counsel">Senior Counsel</option>
                <option value="General Counsel">General Counsel</option>
                <option value="Legal Operations">Legal Operations</option>
                <option value="Risk & Compliance Manager">Risk & Compliance Manager</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] dark:bg-[#1C1C1C] border border-[#E2DFD6] dark:border-[#27272A] rounded-xl text-xs text-[#18181B] dark:text-slate-100 font-medium focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] hover:bg-black dark:hover:bg-slate-100 font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <span>{isLoading ? 'Creating Account...' : 'Register Account'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#18181B] dark:text-white underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
