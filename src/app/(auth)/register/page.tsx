'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Senior Counsel');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900">
      {/* Left Column - Pioneering Legal Intelligence Hero Banner */}
      <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-screen p-8 lg:p-16 xl:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800/80 bg-[#FAF9F6] dark:bg-[#0E0E0E] bg-legalos-grid relative">
        <div className="space-y-6 max-w-lg mt-4 lg:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight leading-[1.15] text-slate-900 dark:text-white uppercase">
              ENTERPRISE<br />
              LEGAL PLATFORM
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 font-sans leading-relaxed"
          >
            Join top legal departments and law firms streamlining contract review, risk intelligence, and regulatory workflows with LegalOS AI.
          </motion.p>
        </div>

        {/* Key Platform Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6 mt-12 lg:mt-16 pt-8 border-t border-slate-300/60 dark:border-slate-800 max-w-lg"
        >
          <div className="border-l-2 border-slate-900 dark:border-white pl-4 space-y-1">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white uppercase font-mono">
              ENTERPRISE RLS SECURITY
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Isolated multi-tenant data architecture with strict Row Level Security.
            </p>
          </div>

          <div className="border-l-2 border-slate-900 dark:border-white pl-4 space-y-1">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white uppercase font-mono">
              WORKFLOW AUTOMATION
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Dispatch contract drafts directly to autonomous AI analysis webhooks.
            </p>
          </div>

          <div className="border-l-2 border-slate-900 dark:border-white pl-4 space-y-1">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white uppercase font-mono">
              ROLE-BASED GOVERNANCE
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Custom workspace roles for Senior Counsel, Operations, and Compliance.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-8 lg:p-16 bg-white dark:bg-[#121212]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm space-y-7"
        >
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-[0.2em] text-slate-900 dark:text-white uppercase">
              LEGALOS
            </h1>
            <p className="text-[10px] tracking-[0.25em] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              REQUEST ACCESS / CREATE ACCOUNT
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 border border-rose-300 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/30 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2.5 rounded-none">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                FULL NAME
              </label>
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-none transition-colors outline-none font-sans"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                CORPORATE EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="s.jenkins@enterprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-none transition-colors outline-none font-sans"
              />
            </div>

            {/* Legal Role Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                PRACTICE ROLE
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-transparent border border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white px-4 py-3 text-xs text-slate-900 dark:text-white rounded-none transition-colors outline-none font-sans cursor-pointer"
              >
                <option value="Senior Counsel" className="dark:bg-[#1A1A1A]">Senior Counsel</option>
                <option value="General Counsel" className="dark:bg-[#1A1A1A]">General Counsel</option>
                <option value="Legal Operations" className="dark:bg-[#1A1A1A]">Legal Operations</option>
                <option value="Risk & Compliance Manager" className="dark:bg-[#1A1A1A]">Risk & Compliance Manager</option>
              </select>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white pl-4 pr-10 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-none transition-colors outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-black dark:hover:bg-slate-100 py-3.5 px-6 font-bold text-xs tracking-[0.2em] uppercase rounded-none transition-all cursor-pointer disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Footer Access Link */}
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-slate-900 dark:text-white hover:underline underline-offset-4 tracking-wide"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
