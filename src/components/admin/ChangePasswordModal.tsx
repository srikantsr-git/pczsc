import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useToast } from '../../context/ToastContext';
import { hashPassword } from '../../utils/cryptoAuth';
import { ShieldCheck, Key, Eye, EyeOff, Lock, X, CheckCircle2 } from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const { adminAuth, updateAdminCredentials, isSuperAdmin } = useCMS();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(adminAuth.username || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validate Current Password
    const currentHash = await hashPassword(currentPassword);
    if (currentHash !== adminAuth.passwordHash) {
      setError('Incorrect current password. Please enter your existing admin password.');
      showToast('Authentication Error', 'Current password verification failed.', 'error');
      return;
    }

    // 2. Validate New Password Length
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      showToast('Validation Error', 'New password must be at least 6 characters long.', 'error');
      return;
    }

    // 3. Validate Password Match
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      showToast('Validation Error', 'New passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAdminCredentials(newUsername, newPassword);
      showToast(
        '🎉 Admin Credentials Updated!',
        'Your new admin password has been encrypted with SHA-256 + Salt and safely stored in Neon DB.',
        'success'
      );
      onClose();
    } catch (err) {
      setError('Failed to update credentials. Please try again.');
      showToast('Update Failed', 'Could not save credentials to database.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-slate-200 shadow-2xl relative space-y-6 text-slate-900 my-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Super Admin — immutable credentials notice */}
        {isSuperAdmin ? (
          <>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Key className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Super Admin Credentials</h2>
              <p className="text-xs text-slate-500">
                Super Administrator login credentials are cryptographically secured at the system level.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Immutable Super Admin Account</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                The Super Admin account (<strong className="text-amber-400">srikantsr</strong>) credentials are hardcoded with SHA-256 cryptographic hashing and cannot be changed from within the admin portal. This is a deliberate security design.
              </p>
              <p className="text-xs text-slate-400">
                To update Super Admin credentials, contact the system developer directly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-santic-red/10 flex items-center justify-center text-santic-red border border-santic-red/20">
                <Key className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Change Admin Password</h2>
              <p className="text-xs text-slate-500">
                Update your admin login username and password. Credentials are encrypted and safely persisted in Neon PostgreSQL DB.
              </p>
            </div>

            {/* Security Info Alert */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Cryptographic Security Active</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                Passwords are hashed using <strong>SHA-256</strong> with a cryptographic salt before saving to Neon DB. Plaintext passwords are never stored anywhere.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Admin Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    placeholder="Enter current password to authorize change"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-santic-red text-sm font-medium text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Admin Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Admin Username *
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-santic-red text-sm font-bold text-slate-900"
                  required
                />
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Admin Password * (Min 6 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-santic-red text-sm font-medium text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  placeholder="Re-enter new password to confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-santic-red text-sm font-medium text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-santic-red hover:bg-santic-hoverRed text-white px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Encrypting & Saving...' : 'Save & Encrypt New Password'}
                </button>
              </div>
            </form>
          </>
        )} {/* end isSuperAdmin ternary */}

      </div>
    </div>
  );
};
