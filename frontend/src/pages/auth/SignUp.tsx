import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Boxes, ArrowRight } from 'lucide-react';

interface SignUpProps {
  onNavigateLogin: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigateLogin }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(email, password, name);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-3">
            <Boxes className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create StockSense Account</h1>
          <p className="text-xs text-slate-500 mt-1">Join your organization's inventory management portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="e.g. Jordan Lee"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="jordan@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:shadow"
          >
            <span>{loading ? 'Creating Account...' : 'Register & Enter Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button onClick={onNavigateLogin} className="font-semibold text-brand-600 hover:underline">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
