'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { AppStorage } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    AppStorage.setLoggedIn(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    AppStorage.resetToDemoData();
    AppStorage.setLoggedIn(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 fill-slate-950" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Habit<span className="text-emerald-400">Forge</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-400">
          Welcome back! Your streak is waiting for you.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl py-8 px-6 shadow-2xl rounded-3xl border border-white/10 sm:px-10 text-white">
          {/* Quick Demo Test Action */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  Instant Local Test Mode
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Pre-loads 30 days of streaks & active habits
                </p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                1-Click Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-500/30 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-white/20"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                Remember my session
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-98 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="font-bold text-emerald-400 hover:text-emerald-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
