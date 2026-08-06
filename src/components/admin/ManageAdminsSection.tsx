import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  Crown,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Key
} from 'lucide-react';

export const ManageAdminsSection: React.FC = () => {
  const { adminUsers, addAdminUser, deleteAdminUser } = useCMS();
  const { showToast } = useToast();

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newUsername.trim()) {
      setError('Username is required.');
      return;
    }

    if (newUsername.trim().toLowerCase() === 'srikantsr') {
      setError('This username is reserved for the Super Administrator.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addAdminUser(newUsername, newPassword);
      if (success) {
        showToast(
          '🎉 Admin Account Created!',
          `New admin "${newUsername.trim()}" has been added successfully. They can now log in.`,
          'success'
        );
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(`Username "${newUsername.trim()}" already exists. Please choose a different username.`);
        showToast('Duplicate Username', 'An admin with this username already exists.', 'error');
      }
    } catch (err) {
      setError('Failed to create admin account. Please try again.');
      showToast('Error', 'Could not create admin account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = (id: string, username: string) => {
    if (window.confirm(`Are you sure you want to remove admin account "${username}"? This action cannot be undone.`)) {
      deleteAdminUser(id);
      showToast('Admin Removed', `Account "${username}" has been permanently deleted.`, 'info');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">Manage Admin Accounts</h2>
            <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full uppercase tracking-wider">
              Super Admin Only
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Create and manage regular administrator accounts. All accounts are stored securely with SHA-256 encrypted passwords.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Crown className="w-4 h-4" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Logged in as Super Admin</span>
          </div>
        </div>
      </div>

      {/* Super Admin Info Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Super Admin Account (Immutable)</p>
            <p className="text-sm font-bold text-white">srikantsr</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Super Admin account has exclusive access to Theme Settings and this Manage Admins panel. 
              Super Admin credentials are cryptographically secured and cannot be changed from within the portal.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left: Add New Admin Form */}
        <div className="space-y-5">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            Add New Admin Account
          </h3>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Password Encrypted at Rest</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Passwords are hashed with <strong className="text-slate-300">SHA-256 + cryptographic salt</strong> before storage. Plaintext passwords are never saved.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleAddAdmin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Username *
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter unique admin username"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-santic-red text-sm font-medium text-white placeholder-slate-600 transition-colors"
                required
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Password * (Min 6 chars)
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-santic-red text-sm font-medium text-white placeholder-slate-600 transition-colors"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password to confirm"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-santic-red text-sm font-medium text-white placeholder-slate-600 transition-colors"
                required
                autoComplete="new-password"
              />
              {confirmPassword && newPassword && (
                <p className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                  {newPassword === confirmPassword
                    ? <><CheckCircle2 className="w-3 h-3" /> Passwords match</>
                    : <><AlertTriangle className="w-3 h-3" /> Passwords do not match</>
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>
        </div>

        {/* Right: Existing Admins List */}
        <div className="space-y-5">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            Active Admin Accounts
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500/20 text-sky-400">
              {adminUsers.length + 1}
            </span>
          </h3>

          <div className="space-y-3">
            {/* Super Admin Row (immutable) */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">srikantsr</p>
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Super Administrator</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Immutable
                </span>
              </div>
            </div>

            {/* Regular Admin Row (default admin) */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-santic-red/10 flex items-center justify-center text-santic-red">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">admin</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Admin</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-700 text-slate-400 uppercase tracking-wider">
                  Default
                </span>
              </div>
            </div>

            {/* Dynamic Admin Users */}
            {adminUsers.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 border-dashed text-center">
                <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No additional admin accounts yet.</p>
                <p className="text-[11px] text-slate-600 mt-1">Use the form to add new admin accounts.</p>
              </div>
            ) : (
              adminUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white">{user.username}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Created: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAdmin(user.id, user.username)}
                    className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title={`Delete ${user.username}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Access Rights Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Access Rights Summary</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-amber-400">Super Admin:</span>
                  <span className="text-slate-400 ml-1">All sections + Theme Settings + Manage Admins</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-santic-red mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">Regular Admin:</span>
                  <span className="text-slate-400 ml-1">Dashboard, Inquiries, Documents, Gallery, Committee, SEO, CMS Settings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
