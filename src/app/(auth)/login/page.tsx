'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Lock, Mail, ArrowRight, Globe, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('s.jenkins@legalos-enterprise.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginOAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleOAuth = async (provider: 'Google' | 'Microsoft') => {
    setIsLoading(true);
    await loginOAuth(provider);
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl z-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-2">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome to LEGALOS</h1>
          <p className="text-xs text-slate-400">Enterprise AI Legal Document Intelligence</p>
        </div>

        {/* OAuth buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuth('Google')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Globe className="w-4 h-4 text-rose-400" />
            <span>Google</span>
          </button>

          <button
            onClick={() => handleOAuth('Microsoft')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span>Microsoft</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest absolute">
            or continue with JWT
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-semibold text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don&apos;t have an enterprise account?{' '}
          <Link href="/register" className="text-blue-400 font-semibold hover:underline">
            Request Workspace Access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
