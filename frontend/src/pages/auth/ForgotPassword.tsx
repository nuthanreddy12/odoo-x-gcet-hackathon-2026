import React, { useState } from 'react';
import { Boxes, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigateLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigateLogin }) => {
  const [email, setEmail] = useState('admin@stocksense.io');
  const [step, setStep] = useState<'REQUEST' | 'VERIFY' | 'SUCCESS'>('REQUEST');
  const [otp, setOtp] = useState('');
  const [demoGeneratedOtp, setDemoGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate or call backend OTP generation
    setTimeout(() => {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoGeneratedOtp(generated);
      setOtp(generated); // pre-populate for demo ease
      setStep('VERIFY');
      setLoading(false);
    }, 400);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep('SUCCESS');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">OTP Password Reset</h1>
          <p className="text-xs text-slate-500 mt-1">
            {step === 'REQUEST' && 'Enter your verified account email to receive a reset OTP.'}
            {step === 'VERIFY' && 'Enter the 6-digit one-time password and your new credentials.'}
            {step === 'SUCCESS' && 'Your credentials have been securely updated.'}
          </p>
        </div>

        {step === 'REQUEST' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              {loading ? 'Generating OTP...' : 'Send Reset OTP Code'}
            </button>
          </form>
        )}

        {step === 'VERIFY' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <span className="font-bold">Demo OTP Dispatched:</span>{' '}
              <span className="font-mono font-bold tracking-widest text-amber-900">{demoGeneratedOtp}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="w-full text-center font-mono tracking-widest text-lg py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter strong password"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              {loading ? 'Updating Password...' : 'Verify OTP & Reset Password'}
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-4 space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-600">Password has been updated. You can now log into your account.</p>
            <button
              onClick={onNavigateLogin}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Back to Login
            </button>
          </div>
        )}

        {step !== 'SUCCESS' && (
          <div className="mt-6 text-center">
            <button
              onClick={onNavigateLogin}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel and return to login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
