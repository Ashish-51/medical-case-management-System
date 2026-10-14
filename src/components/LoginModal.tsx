import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Activity, Shield, UserCheck, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: User, token: string) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@jajalmedical.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      onLoginSuccess(data.data.user, data.data.token);
    } catch (err) {
      setError('Connection failed. Please verify server status.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetRole: UserRole) => {
    if (presetRole === 'Admin') {
      setEmail('admin@jajalmedical.com');
      setPassword('admin123');
    } else if (presetRole === 'Engineer') {
      setEmail('engineer@jajalmedical.com');
      setPassword('engineer123');
    } else {
      setEmail('viewer@jajalmedical.com');
      setPassword('viewer123');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 sm:p-8 relative">
        {/* Header Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Jajal Medical Auth
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access implant case records, analytics, and APIs
          </p>
        </div>

        {/* Preset Credentials Picker */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" /> Demo Credentials:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handlePresetSelect('Admin')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-md border text-center transition-all ${
                email === 'admin@jajalmedical.com'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('Engineer')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-md border text-center transition-all ${
                email === 'engineer@jajalmedical.com'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Engineer
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('Viewer')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-md border text-center transition-all ${
                email === 'viewer@jajalmedical.com'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Viewer
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="admin@jajalmedical.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Need dummy credentials for your review? Admin: <code className="text-slate-700 font-mono">admin123</code> | Viewer: <code className="text-slate-700 font-mono">viewer123</code>
          </p>
        </div>
      </div>
    </div>
  );
};
