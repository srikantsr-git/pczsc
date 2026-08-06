import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { useToast } from '../context/ToastContext';
import { Lock, X, Shield, Key } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => {
  const { login } = useCMS();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        showToast(
          '🎉 Welcome!',
          'You are now logged in with full CMS & Admin permissions.',
          'success'
        );
        onClose();
      } else {
        setError('Invalid username or password. Please verify your credentials.');
        showToast(
          'Login Failed',
          'Invalid admin credentials. Please enter authorized username and password.',
          'error'
        );
      }
    } catch (err) {
      setError('Authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-200 shadow-2xl relative space-y-6 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-santic-red/10 flex items-center justify-center text-santic-red mb-4 border border-santic-red/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Admin Portal Login</h2>
          <p className="text-xs text-slate-500">
            Enter authorized credentials to access the PCZSC Admin Control Center.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your admin username"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-santic-red text-sm font-medium text-slate-900"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-santic-red text-sm font-medium text-slate-900"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-santic-red hover:bg-santic-hoverRed text-white py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 disabled:opacity-60"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Access is restricted to authorized PCZSC Secretariat personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};

