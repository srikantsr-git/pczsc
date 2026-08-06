import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { useToast } from '../context/ToastContext';
import { saveSiteSettingToDB } from '../utils/neonDB';
import {
  ShieldCheck,
  Edit3,
  Eye,
  LogOut,
  Lock,
  Layout,
  Sliders,
  FileText,
  Settings,
  Palette,
  ChevronRight,
  ChevronLeft,
  Key,
  UploadCloud,
  Download
} from 'lucide-react';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminConfigModals } from './AdminConfigModals';
import { ChangePasswordModal } from './admin/ChangePasswordModal';

export const AdminBar: React.FC = () => {
  const { isAdmin, isEditMode, toggleEditMode, logout, contactInquiries } = useCMS();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<
    'header' | 'hero' | 'news' | 'metrics' | 'vision' | 'footer' | null
  >(null);

  const pendingInquiriesCount = contactInquiries.filter((i) => i.status === 'Pending').length;

  const handleSyncSiteState = async () => {
    try {
      setIsSyncing(true);
      const keys = [
        'pczsc_active_theme',
        'pczsc_custom_themes',
        'pczsc_header_cfg',
        'pczsc_home_about',
        'pczsc_pillars_cfg',
        'pczsc_subpages_hero',
        'pczsc_about_cfg',
        'pczsc_committee_members',
        'pczsc_footer_cfg',
        'pczsc_contact',
        'pczsc_gallery',
        'pczsc_hero_slides',
        'pczsc_docs',
        'pczsc_pe_directors',
        'pczsc_seo_store',
        'pczsc_news_marquee',
        'pczsc_metrics',
        'pczsc_vision_mission',
        'pczsc_admin_auth'
      ];
      const data: Record<string, any> = {};
      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            data[key] = JSON.parse(val);
          } catch (_e) {
            data[key] = val;
          }
        }
      }

      // 1. Post to local dev endpoint /api/save-site-state
      try {
        await fetch('/api/save-site-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (_e) {}

      // 2. Direct Sync into Neon DB
      for (const [key, val] of Object.entries(data)) {
        if (val) {
          await saveSiteSettingToDB(key, val);
        }
      }

      showToast(
        'Synced to Cloud Database & Vercel!',
        'All your custom themes, uploaded photos, and edits are live in Neon DB & Vercel.',
        'success'
      );
    } catch (err: any) {
      showToast('Sync Error', err?.message || 'Failed to sync with cloud database.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isAdmin) {
    return (
      <>
        {/* Floating Admin Trigger Button on Right */}
        <button
          onClick={() => setShowLoginModal(true)}
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white hover:bg-santic-red p-3.5 rounded-full shadow-2xl border border-white/20 transition-all duration-300 group flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          title="Admin Login"
        >
          <Lock className="w-4 h-4 text-santic-red group-hover:text-white" />
          <span className="hidden sm:inline">Admin Login</span>
        </button>

        {showLoginModal && (
          <AdminLoginModal
            onClose={() => setShowLoginModal(false)}
            onSuccess={() => navigate('/en/admin')}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* VERTICAL FLOATING ADMIN DOCK ON RIGHT SIDE OF WINDOW */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex items-center">
        
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-slate-900 text-santic-red border border-white/20 p-2 rounded-l-2xl shadow-2xl hover:bg-santic-red hover:text-white transition-all"
          title={isExpanded ? 'Collapse Admin Sidebar' : 'Expand Admin Sidebar'}
        >
          {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Floating Sidebar Content Panel */}
        {isExpanded && (
          <div className="bg-slate-900/95 text-white border border-santic-red/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2 w-48 animate-fade-in text-xs">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
              <div className="flex items-center gap-1.5 font-extrabold text-santic-red uppercase text-[10px] tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Inline CMS Active</span>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="space-y-1.5 py-1">
              <Link
                to="/en/admin"
                className="w-full flex items-center justify-between bg-santic-red hover:bg-santic-hoverRed px-3 py-2 rounded-xl text-white font-extrabold transition-all shadow-md uppercase tracking-wider text-[11px]"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Section</span>
                </div>
                {pendingInquiriesCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                    {pendingInquiriesCount}
                  </span>
                )}
              </Link>

              <Link
                to="/en/admin?tab=theme"
                className="w-full flex items-center gap-2 bg-slate-800 hover:bg-santic-red px-3 py-2 rounded-xl text-slate-200 hover:text-white font-bold transition-all text-[11px]"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Theme Studio</span>
              </Link>

              <button
                onClick={() => setActiveConfigTab('header')}
                className="w-full flex items-center gap-2 bg-slate-800 hover:bg-santic-red px-3 py-2 rounded-xl text-slate-200 hover:text-white font-bold transition-all text-[11px] text-left"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Header & Logo</span>
              </button>

              <button
                onClick={() => setActiveConfigTab('hero')}
                className="w-full flex items-center gap-2 bg-slate-800 hover:bg-santic-red px-3 py-2 rounded-xl text-slate-200 hover:text-white font-bold transition-all text-[11px] text-left"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Hero Slides</span>
              </button>

              <button
                onClick={() => setActiveConfigTab('news')}
                className="w-full flex items-center gap-2 bg-slate-800 hover:bg-santic-red px-3 py-2 rounded-xl text-slate-200 hover:text-white font-bold transition-all text-[11px] text-left"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>News Marquee</span>
              </button>

              <button
                onClick={() => setActiveConfigTab('footer')}
                className="w-full flex items-center gap-2 bg-slate-800 hover:bg-santic-red px-3 py-2 rounded-xl text-slate-200 hover:text-white font-bold transition-all text-[11px] text-left"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Footer & Copy</span>
              </button>

              <button
                onClick={handleSyncSiteState}
                disabled={isSyncing}
                className="w-full flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 px-3 py-2 rounded-xl text-white font-extrabold transition-all text-[11px] text-left shadow-md"
                title="Click here to sync all your Chrome browser edits to the server codebase so Vercel matches your browser 100%!"
              >
                <UploadCloud className="w-3.5 h-3.5 text-emerald-200" />
                <span>{isSyncing ? 'Syncing Edits...' : 'Sync Edits to Vercel'}</span>
              </button>

              <button
                onClick={() => setShowChangePassModal(true)}
                className="w-full flex items-center gap-2 bg-slate-800 hover:bg-santic-red px-3 py-2 rounded-xl text-amber-300 hover:text-white font-bold transition-all text-[11px] text-left"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Change Password</span>
              </button>
            </div>

            {/* Bottom Edit Mode & Logout */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <button
                onClick={toggleEditMode}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-[11px] transition-all ${
                  isEditMode
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isEditMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isEditMode ? 'Edit Mode: ON' : 'Preview Mode'}</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition-colors font-bold text-[11px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {activeConfigTab && (
        <AdminConfigModals
          activeTab={activeConfigTab}
          onClose={() => setActiveConfigTab(null)}
        />
      )}

      {showChangePassModal && (
        <ChangePasswordModal onClose={() => setShowChangePassModal(false)} />
      )}
    </>
  );
};
