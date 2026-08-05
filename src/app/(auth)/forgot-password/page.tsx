'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scale, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-2">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Reset Password</h1>
          <p className="text-xs text-slate-400">Enter your corporate email to receive a recovery link</p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-emerald-200">Recovery Email Dispatched</h4>
            <p className="text-xs text-slate-300">
              We sent password reset instructions to <span className="font-bold text-white">{email}</span>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:underline pt-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="s.jenkins@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Send Reset Instructions
            </button>
          </form>
        )}

        {!submitted && (
          <p className="text-center text-xs">
            <Link href="/login" className="text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
