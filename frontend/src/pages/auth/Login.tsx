import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Boxes, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LoginProps {
  onNavigateSignUp: () => void;
  onNavigateForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateSignUp, onNavigateForgotPassword }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('admin@stocksense.io');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-3">
            <Boxes className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to StockSense</h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Inventory & Warehouse Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-[11px] text-brand-600 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:shadow"
          >
            <span>{loading ? 'Authenticating...' : 'Sign in to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
          <div className="relative flex justify-center text-[10px] uppercase text-slate-400 font-semibold bg-white px-2">
            Instant Demo Access
          </div>
        </div>

        <button
          type="button"
          onClick={demoLogin}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors border border-slate-200/80"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Demo Login (Pre-filled Admin)</span>
        </button>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button onClick={onNavigateSignUp} className="font-semibold text-brand-600 hover:underline">
            Create an Account
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>Secured by Supabase Auth & JWT</span>
        </div>
      </div>
    </div>
  );
};
