'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await authService.login(email, password);
      await initAuth();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[LoginPage] Sign in error:', err);
      setErrorMsg(err.message || 'Invalid login credentials. Please try again.');
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
              PIONEERING<br />
              LEGAL INTELLIGENCE
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 font-sans leading-relaxed"
          >
            LegalOS harnesses the power of advanced AI to analyze contracts, extract critical clauses, and mitigate risks in seconds. Designed for modern, fast-moving legal teams.
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
              CONTRACT ANALYSIS
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Deep-scan agreements for non-standard terms instantly.
            </p>
          </div>

          <div className="border-l-2 border-slate-900 dark:border-white pl-4 space-y-1">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white uppercase font-mono">
              RISK MITIGATION
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Identify exposure and regulatory conflicts before signing.
            </p>
          </div>

          <div className="border-l-2 border-slate-900 dark:border-white pl-4 space-y-1">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white uppercase font-mono">
              PRECEDENT SEARCH
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Access historical institutional knowledge seamlessly.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Luxury Sign In Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-8 lg:p-16 bg-white dark:bg-[#121212]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-[0.2em] text-slate-900 dark:text-white uppercase">
              LEGALOS
            </h1>
            <p className="text-[10px] tracking-[0.25em] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              LEGAL AI PLATFORM
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 border border-rose-300 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/30 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2.5 rounded-none">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                WORK EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-none transition-colors outline-none font-sans"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
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
              <span>{isLoading ? 'SIGNING IN...' : 'SIGN IN'}</span>
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Footer Access Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Need an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-slate-900 dark:text-white hover:underline underline-offset-4 tracking-wide"
            >
              Request Access
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
