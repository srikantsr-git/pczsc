import React, { useState } from 'react';
import { useCMS, ContactInquiry } from '../context/CMSContext';
import { useTheme } from '../context/ThemeContext';
import { PRESET_THEMES } from '../utils/themePresets';
import { PresetThemeId, FontFamily } from '../types/theme';
import { generateCssVariables } from '../utils/themeEngine';
import { SubPageHero } from '../components/SubPageHero';
import {
  LayoutDashboard,
  Palette,
  Mail,
  FileText,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  Edit,
  Trash2,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Building,
  Lock,
  Copy,
  ChevronRight,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Check,
  Search,
  Key,
  Layout,
  Filter,
  Users,
  Globe,
  Crown,
  X
} from 'lucide-react';
import { AdminLoginModal } from '../components/AdminLoginModal';
import { AdminConfigModals } from '../components/AdminConfigModals';
import { FileUploadInput } from '../components/FileUploadInput';
import { SEOSettingsForm } from '../components/admin/SEOSettingsForm';
import { generateXmlSitemap, generateRobotsTxt } from '../utils/sitemapGenerator';
import { useToast } from '../context/ToastContext';
import { sanitizeInput, containsSqlInjection } from '../utils/security';
import {
  saveSiteSettingToDB,
  saveHeroSlideToDB,
  savePEDirectorToDB,
  saveGalleryItemToDB,
  saveDocumentToDB
} from '../utils/neonDB';
import { getDocumentPdfUrl } from '../utils/documentUtils';
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal';
import { ManageAdminsSection } from '../components/admin/ManageAdminsSection';

import { useSearchParams } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'overview';

  const {
    isAdmin,
    isSuperAdmin,
    isEditMode,
    toggleEditMode,
    logout,
    contactInquiries,
    answerContactInquiry,
    deleteContactInquiry,
    documents,
    addDocument,
    editDocument,
    deleteDocument,
    toggleDocumentNewsMarquee,
    galleryCategories,
    addGalleryCategory,
    deleteGalleryCategory,
    galleryItems,
    addGalleryItem,
    deleteGalleryItem,
    committeeMembers,
    addCommitteeMember,
    editCommitteeMember,
    deleteCommitteeMember,
    resetCommitteeMembers,
    headerConfig,
    homeAboutConfig,
    pillarsConfig,
    subPagesHeroStore,
    aboutUsConfig,
    footerConfig,
    contactInfo,
    seoStore,
    heroSlides,
    peDirectors
  } = useCMS();

  const {
    draftTheme,
    updateTheme,
    applyPreset,
    resetTheme,
    publishTheme,
    isPublished
  } = useTheme();

  const { showToast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAllToDB = async () => {
    try {
      setIsSyncing(true);
      await saveSiteSettingToDB('pczsc_header_cfg', headerConfig);
      await saveSiteSettingToDB('pczsc_home_about', homeAboutConfig);
      await saveSiteSettingToDB('pczsc_pillars_cfg', pillarsConfig);
      await saveSiteSettingToDB('pczsc_subpages_hero', subPagesHeroStore);
      await saveSiteSettingToDB('pczsc_about_cfg', aboutUsConfig);
      await saveSiteSettingToDB('pczsc_committee_members', committeeMembers);
      await saveSiteSettingToDB('pczsc_footer_cfg', footerConfig);
      await saveSiteSettingToDB('pczsc_contact', contactInfo);
      await saveSiteSettingToDB('pczsc_seo_store', seoStore);
      await saveSiteSettingToDB('pczsc_active_theme', draftTheme);

      heroSlides.forEach((s, idx) => saveHeroSlideToDB(s, idx));
      galleryItems.forEach((g) => saveGalleryItemToDB(g));
      documents.forEach((d) => saveDocumentToDB(d));
      peDirectors.forEach((pd) => savePEDirectorToDB(pd));

      showToast(
        '🎉 All Local & Admin Edits Synced to Live Site (Neon DB)!',
        'All local admin edits, background photos, active theme, and content are now live on https://pczsc.vercel.app.',
        'success'
      );
    } catch (err) {
      showToast('Sync Error', 'Could not sync all data to Neon DB.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePublishTheme = () => {
    publishTheme();
    showToast(
      '🎉 Theme Published Successfully!',
      `Preset "${draftTheme.name}" and your customized styling tokens are now live site-wide.`,
      'success'
    );
  };
  const [activeNav, setActiveNav] = useState<
    'overview' | 'theme' | 'inquiries' | 'documents' | 'gallery' | 'cms' | 'committee' | 'seo' | 'manage-admins'
  >(initialTab);

  const [selectedSEOPage, setSelectedSEOPage] = useState<string>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);

  // Contact Inquiries Selection & Search State
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    contactInquiries[0]?.id || null
  );
  const [inquiryFilter, setInquiryFilter] = useState<'All' | 'Pending' | 'Answered'>('All');
  const [inquirySearch, setInquirySearch] = useState('');
  const [replyText, setReplyText] = useState('');

  // Document Editing State in Admin Portal
  const [editingDocAdmin, setEditingDocAdmin] = useState<any | null>(null);
  const [showAddDocAdmin, setShowAddDocAdmin] = useState(false);
  const [addDocTitle, setAddDocTitle] = useState('');
  const [addDocCategory, setAddDocCategory] = useState<any>('Circulars');
  const [addDocAcademicYear, setAddDocAcademicYear] = useState('2026-27');
  const [addDocDate, setAddDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [addDocUrl, setAddDocUrl] = useState('');

  // Committee Member Management State
  const [committeeSearch, setCommitteeSearch] = useState('');
  const [showCommitteeModal, setShowCommitteeModal] = useState(false);
  const [editingCommitteeMember, setEditingCommitteeMember] = useState<any | null>(null);

  const [cmName, setCmName] = useState('');
  const [cmDesignation, setCmDesignation] = useState('');
  const [cmPhoto, setCmPhoto] = useState('');
  const [cmCollegeAddress, setCmCollegeAddress] = useState('');
  const [cmContactDetails, setCmContactDetails] = useState('');

  const handleOpenAddCommitteeMember = () => {
    setEditingCommitteeMember(null);
    setCmName('');
    setCmDesignation('');
    setCmPhoto('');
    setCmCollegeAddress('');
    setCmContactDetails('');
    setShowCommitteeModal(true);
  };

  const handleOpenEditCommitteeMember = (member: any) => {
    setEditingCommitteeMember(member);
    setCmName(member.name);
    setCmDesignation(member.designation);
    setCmPhoto(member.photo);
    setCmCollegeAddress(member.collegeAddress);
    setCmContactDetails(member.contactDetails);
    setShowCommitteeModal(true);
  };

  const handleSaveCommitteeMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmName.trim() || !cmDesignation.trim()) {
      showToast('Validation Error', 'Please enter both Name and Designation.', 'error');
      return;
    }

    if (containsSqlInjection(cmName) || containsSqlInjection(cmCollegeAddress)) {
      showToast(
        'Security Alert: Invalid Input',
        'Suspicious script tags or invalid characters detected.',
        'error'
      );
      return;
    }

    const payload = {
      name: sanitizeInput(cmName),
      designation: sanitizeInput(cmDesignation),
      photo: cmPhoto.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      collegeAddress: sanitizeInput(cmCollegeAddress),
      contactDetails: sanitizeInput(cmContactDetails)
    };

    if (editingCommitteeMember) {
      editCommitteeMember(editingCommitteeMember.id, payload);
      showToast(
        '🎉 Member Updated!',
        `Updated ${payload.name}'s committee details successfully.`,
        'success'
      );
    } else {
      addCommitteeMember(payload);
      showToast(
        '🎉 New Member Added!',
        `Added ${payload.name} to PCZSC Committee.`,
        'success'
      );
    }

    setShowCommitteeModal(false);
  };

  const handleDeleteCommitteeMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from PCZSC Committee?`)) {
      deleteCommitteeMember(id);
      showToast('Member Removed', `${name} has been removed from PCZSC Committee.`, 'info');
    }
  };

  // Theme Settings Sub-tab State
  const [themeSubTab, setThemeSubTab] = useState<
    'presets' | 'colors' | 'fonts' | 'radii' | 'code'
  >('presets');

  // CMS Modal tab state
  const [activeConfigTab, setActiveConfigTab] = useState<
    'header' | 'hero' | 'news' | 'metrics' | 'vision' | 'footer' | null
  >(null);

  const [copiedCode, setCopiedCode] = useState(false);

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
        <SubPageHero
          pageKey="contact"
          category="Admin Portal"
          title="Secretariat Admin Control Center"
          subtitle="Please sign in with administrator credentials (admin / admin123) to manage website theme settings and contact inquiries."
        />

        <section className="santic-section bg-slate-50/70">
          <div className="santic-container max-w-md mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl text-white">
              <div className="w-16 h-16 rounded-2xl bg-santic-red/10 border border-santic-red/30 flex items-center justify-center mx-auto text-santic-red">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">PCZSC Admin Login</h2>
                <p className="text-xs text-slate-400">
                  Authorized access for Pune City Zonal Sports Committee administrators.
                </p>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-santic-red hover:bg-santic-hoverRed text-white py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all"
              >
                Open Admin Login Modal
              </button>
            </div>
          </div>
        </section>

        {showLoginModal && (
          <AdminLoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </main>
    );
  }

  // Filtered Inquiries List
  const filteredInquiries = contactInquiries.filter((inq) => {
    const matchesStatus =
      inquiryFilter === 'All' ||
      (inquiryFilter === 'Pending' && inq.status === 'Pending') ||
      (inquiryFilter === 'Answered' && inq.status === 'Answered');
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.subject.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (inq.college && inq.college.toLowerCase().includes(inquirySearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const selectedInquiry =
    contactInquiries.find((i) => i.id === selectedInquiryId) || filteredInquiries[0] || null;

  const pendingCount = contactInquiries.filter((i) => i.status === 'Pending').length;

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInquiry && replyText.trim()) {
      if (containsSqlInjection(replyText)) {
        showToast(
          'Security Alert: SQL Injection Blocked',
          'Suspicious characters or SQL script tags detected in reply input. Please enter valid text.',
          'error'
        );
        return;
      }
      answerContactInquiry(selectedInquiry.id, sanitizeInput(replyText));
      setReplyText('');
      showToast(
        '🎉 Official Response Sent!',
        `Your reply has been saved and the inquiry status updated to Answered.`,
        'success'
      );
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const googleFonts: FontFamily[] = [
    'Inter',
    'Poppins',
    'Roboto',
    'Open Sans',
    'Nunito',
    'Lato',
    'Montserrat',
    'Work Sans',
    'Source Sans Pro',
    'Manrope'
  ];

  const sidebarNavItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" />, forAll: true },
    { id: 'committee', label: 'PCZSC Committee', icon: <Users className="w-4 h-4 text-emerald-400" />, forAll: true },
    {
      id: 'inquiries',
      label: 'Contact Queries',
      icon: <Mail className="w-4 h-4 text-amber-400" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
      forAll: true
    },
    { id: 'documents', label: 'Documents & Circulars', icon: <FileText className="w-4 h-4" />, forAll: true },
    { id: 'gallery', label: 'Photo & Video Gallery', icon: <ImageIcon className="w-4 h-4" />, forAll: true },
    { id: 'seo', label: 'SEO & Meta Tags', icon: <Globe className="w-4 h-4 text-sky-400" />, forAll: true },
    { id: 'cms', label: 'Site CMS Settings', icon: <Settings className="w-4 h-4" />, forAll: true },
    // Super admin only items
    { id: 'theme', label: 'Theme Settings', icon: <Palette className="w-4 h-4 text-purple-400" />, forAll: false, superAdminOnly: true },
    { id: 'manage-admins', label: 'Manage Admins', icon: <Crown className="w-4 h-4 text-amber-400" />, forAll: false, superAdminOnly: true },
  ];

  // Filter nav items based on role
  const visibleNavItems = sidebarNavItems.filter(item => item.forAll || (item.superAdminOnly && isSuperAdmin));

  return (
    <main className="min-h-screen bg-slate-50/70 text-slate-900 font-sans flex flex-col">
      {/* Subpage Hero Section (Consistent with all other pages) */}
      <SubPageHero
        pageKey="contact"
        category="Admin Management"
        title="Secretariat Admin Control Center"
        subtitle="Manage website theme styling, review and reply to official contact inquiries, and publish tournament documents."
      />

      {/* TWO COLUMN MASTER-DETAIL SECTION */}
      <section className="santic-section py-8 flex-1">
        <div className="santic-container">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[680px] text-white">
            
            {/* LEFT COLUMN: SIDEBAR NAVIGATION */}
            <aside className="w-full lg:w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 p-5 space-y-4">
              <div className="px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Navigation Menu</span>
                {isSuperAdmin ? (
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Crown className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Super Admin</span>
                  </div>
                ) : (
                  <ShieldCheck className="w-4 h-4 text-santic-red" />
                )}
              </div>

              {/* Mobile Navigation Select Dropdown (< lg) */}
              <div className="lg:hidden w-full space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Select Navigation Module
                </label>
                <select
                  value={activeNav}
                  onChange={(e) => setActiveNav(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-extrabold text-white focus:outline-none focus:border-santic-red shadow-inner cursor-pointer"
                >
                  {visibleNavItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} {item.badge !== undefined ? `(${item.badge})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop Navigation Menu (>= lg) */}
              <nav className="hidden lg:block space-y-1.5 flex-1">
                {visibleNavItems.map((item) => {
                  const isActive = activeNav === item.id;
                  const isSuperAdminItem = (item as any).superAdminOnly;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id as any)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-extrabold transition-all duration-200 ${
                        isActive
                          ? isSuperAdminItem
                            ? 'bg-amber-500/20 text-amber-300 shadow-lg border border-amber-500/30'
                            : 'bg-santic-red text-white shadow-lg shadow-red-500/25 border border-white/20'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge !== undefined && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                            {item.badge}
                          </span>
                        )}
                        {isSuperAdminItem && !isActive && (
                          <Crown className="w-3 h-3 text-amber-500/60" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Active Theme Status Widget — Super Admin Only */}
              {isSuperAdmin && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                    <Palette className="w-3 h-3" /> Active Theme
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white truncate">{draftTheme.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <button
                    onClick={handlePublishTheme}
                    className="w-full mt-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 py-2 rounded-xl text-[11px] font-extrabold uppercase transition-all"
                  >
                    Publish Theme Now
                  </button>
                </div>
              )}

              {/* Session Info Widget */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  {isSuperAdmin ? (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-santic-red/10 flex items-center justify-center text-santic-red">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-extrabold text-white truncate">
                      {isSuperAdmin ? 'srikantsr' : 'Admin'}
                    </p>
                    <p className={`text-[10px] font-bold ${isSuperAdmin ? 'text-amber-400' : 'text-santic-red'}`}>
                      {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                    title="Logout"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </aside>

            {/* RIGHT COLUMN: DETAILS PANE */}
            <section className="flex-1 bg-slate-900 flex flex-col p-6 lg:p-8 space-y-8 overflow-y-auto scrollbar-thin">
              
              {/* ========================================================================= */}
              {/* 1. DASHBOARD OVERVIEW */}
              {/* ========================================================================= */}
              {activeNav === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-white">Dashboard Overview</h2>
                      <p className="text-xs text-slate-400">System metrics and live database synchronization controls.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        onClick={() => setShowChangePassModal(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 border border-slate-700 uppercase tracking-wider transition-all hover:scale-105 shrink-0"
                      >
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Change Admin Password</span>
                      </button>
                      <button
                        onClick={handleSyncAllToDB}
                        disabled={isSyncing}
                        className="bg-santic-red hover:bg-santic-hoverRed text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xl border border-white/20 uppercase tracking-wider transition-all hover:scale-105 shrink-0"
                      >
                        <Globe className="w-4 h-4 animate-spin-slow" />
                        <span>{isSyncing ? 'Syncing to Live DB...' : 'Push All Local Edits to Live Site (Neon DB)'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Queries</span>
                      <div className="text-4xl font-black text-amber-400 font-numeric">{pendingCount}</div>
                      <p className="text-xs text-slate-500">Requires secretariat reply</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Theme Preset</span>
                      <div className="text-xl font-extrabold text-white truncate">{draftTheme.name}</div>
                      <p className="text-xs text-emerald-400 font-bold">{isPublished ? 'Published' : 'Draft'}</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Documents</span>
                      <div className="text-4xl font-black text-santic-red font-numeric">{documents.length}</div>
                      <p className="text-xs text-slate-500">Circulars, calendars & draws</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gallery Items</span>
                      <div className="text-4xl font-black text-sky-400 font-numeric">{galleryItems.length}</div>
                      <p className="text-xs text-slate-500">Photos & videos uploaded</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Quick Action Shortcuts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setActiveNav('inquiries')}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-santic-red text-left space-y-2 group transition-all"
                      >
                        <div className="flex items-center justify-between text-amber-400 font-bold text-xs uppercase">
                          <span>Support Inbox</span>
                          <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-sm font-extrabold text-white">Answer Contact Queries</h4>
                        <p className="text-xs text-slate-400">Review incoming queries and send official replies.</p>
                      </button>

                      {isSuperAdmin ? (
                        <button
                          onClick={() => setActiveNav('theme')}
                          className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-amber-500/5 border border-amber-500/20 hover:border-amber-400 text-left space-y-2 group transition-all"
                        >
                          <div className="flex items-center justify-between text-amber-400 font-bold text-xs uppercase">
                            <span>Theme Studio</span>
                            <Palette className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </div>
                          <h4 className="text-sm font-extrabold text-white">Theme Settings</h4>
                          <p className="text-xs text-slate-400">Customize colors, Google Fonts, and border radius tokens.</p>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveNav('seo')}
                          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-santic-red text-left space-y-2 group transition-all"
                        >
                          <div className="flex items-center justify-between text-sky-400 font-bold text-xs uppercase">
                            <span>SEO Manager</span>
                            <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </div>
                          <h4 className="text-sm font-extrabold text-white">SEO & Meta Tags</h4>
                          <p className="text-xs text-slate-400">Manage page titles, meta descriptions and sitemap generation.</p>
                        </button>
                      )}

                      <button
                        onClick={() => setActiveNav('documents')}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-santic-red text-left space-y-2 group transition-all"
                      >
                        <div className="flex items-center justify-between text-emerald-400 font-bold text-xs uppercase">
                          <span>Documents</span>
                          <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-sm font-extrabold text-white">Upload New Circular PDF</h4>
                        <p className="text-xs text-slate-400">Publish sports calendars, AIU orders, and tournament draws.</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 2. THEME SETTINGS (CLEAN CARD-BASED LAYOUT) */}
              {/* ========================================================================= */}
              {activeNav === 'theme' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">Theme Settings & Styling Studio</h2>
                      <p className="text-xs text-slate-400">Customize website presets, colors, Google Fonts, and CSS variables in real time.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={resetTheme}
                        className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        Reset Default
                      </button>
                      <button
                        onClick={handlePublishTheme}
                        className="px-6 py-2.5 rounded-xl bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-500/20"
                      >
                        Publish Theme
                      </button>
                    </div>
                  </div>

                  {/* Sub Navigation Bar for Theme Settings */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                    {[
                      { id: 'presets', label: '10 Built-in Presets', icon: <Sparkles className="w-3.5 h-3.5" /> },
                      { id: 'colors', label: 'Color Tokens', icon: <Palette className="w-3.5 h-3.5" /> },
                      { id: 'fonts', label: 'Google Fonts', icon: <Sliders className="w-3.5 h-3.5" /> },
                      { id: 'radii', label: 'Border Radii & Spacing', icon: <Layout className="w-3.5 h-3.5" /> },
                      { id: 'code', label: 'CSS / Tailwind Code', icon: <Copy className="w-3.5 h-3.5" /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setThemeSubTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                          themeSubTab === tab.id
                            ? 'bg-santic-red text-white shadow-md'
                            : 'bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* SUB-TAB 1: 10 PRESETS CARDS */}
                  {themeSubTab === 'presets' && (
                    <div className="space-y-6">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                        Choose from 10 Professional Theme Presets:
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(PRESET_THEMES).map((preset) => (
                          <div
                            key={preset.presetId}
                            className={`p-6 rounded-3xl border text-left space-y-4 transition-all duration-300 relative group ${
                              draftTheme.presetId === preset.presetId
                                ? 'bg-santic-red/10 border-santic-red shadow-2xl ring-2 ring-santic-red/50'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 h-4 w-24 rounded-full overflow-hidden border border-white/20">
                                <div className="h-full flex-1" style={{ backgroundColor: preset.primaryColors.primary }} />
                                <div className="h-full flex-1" style={{ backgroundColor: preset.backgroundColors.body }} />
                                <div className="h-full flex-1" style={{ backgroundColor: preset.backgroundColors.card }} />
                                <div className="h-full flex-1" style={{ backgroundColor: preset.textColors.primary }} />
                              </div>

                              {draftTheme.presetId === preset.presetId && (
                                <span className="px-2 py-0.5 rounded-full bg-santic-red text-white text-[10px] font-extrabold uppercase tracking-wider">
                                  Active Preset
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-base font-extrabold text-white">{preset.name}</h3>
                              <p className="text-xs text-slate-400 leading-relaxed font-normal">{preset.description}</p>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                              <span className="text-slate-400 font-mono">Font: <strong>{preset.typography.bodyFont}</strong></span>
                              <button
                                onClick={() => applyPreset(preset.presetId as PresetThemeId)}
                                className="bg-santic-red hover:bg-santic-hoverRed text-white px-4 py-2 rounded-xl font-extrabold uppercase tracking-wider text-[11px] transition-all shadow-md"
                              >
                                Apply Preset
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: COLOR TOKENS GRID */}
                  {themeSubTab === 'colors' && (
                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Primary Palette Tokens</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {Object.entries(draftTheme.primaryColors).map(([key, val]) => (
                            <div key={key} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                              <span className="text-xs font-bold text-slate-400 capitalize block">{key} Color</span>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-white font-bold">{val}</span>
                                <input
                                  type="color"
                                  value={val}
                                  onChange={(e) =>
                                    updateTheme((prev) => ({
                                      ...prev,
                                      primaryColors: { ...prev.primaryColors, [key]: e.target.value }
                                    }))
                                  }
                                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Background Tokens</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {Object.entries(draftTheme.backgroundColors).map(([key, val]) => (
                            <div key={key} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                              <span className="text-xs font-bold text-slate-400 capitalize block">{key} Background</span>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-white font-bold">{val}</span>
                                <input
                                  type="color"
                                  value={val}
                                  onChange={(e) =>
                                    updateTheme((prev) => ({
                                      ...prev,
                                      backgroundColors: { ...prev.backgroundColors, [key]: e.target.value }
                                    }))
                                  }
                                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: GOOGLE FONTS & FONT SIZING CONTROLS */}
                  {themeSubTab === 'fonts' && (
                    <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-8">
                      <div className="space-y-1 border-b border-slate-800 pb-4">
                        <h3 className="text-base font-extrabold uppercase tracking-wider text-white">Typography & Font Size Controls</h3>
                        <p className="text-xs text-slate-400">Increase or decrease font sizes for headings, paragraphs, navigation menus, and logo in real time.</p>
                      </div>
                      
                      {/* Font Family Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-300 uppercase">Body Font Family</label>
                          <select
                            value={draftTheme.typography.bodyFont}
                            onChange={(e) =>
                              updateTheme((prev) => ({
                                ...prev,
                                typography: { ...prev.typography, bodyFont: e.target.value as FontFamily }
                              }))
                            }
                            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-sm"
                          >
                            {googleFonts.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-300 uppercase">Heading Font Family</label>
                          <select
                            value={draftTheme.typography.headingFont}
                            onChange={(e) =>
                              updateTheme((prev) => ({
                                ...prev,
                                typography: { ...prev.typography, headingFont: e.target.value as FontFamily }
                              }))
                            }
                            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-sm"
                          >
                            {googleFonts.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Dynamic Font Sizing Controllers */}
                      <div className="space-y-6 pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-extrabold text-santic-red uppercase tracking-widest">
                          Font Size Scaling (Increase / Decrease)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 1. All Headings Font Size */}
                          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Headings Font Size
                              </span>
                              <span className="font-mono text-xs font-extrabold text-santic-red bg-santic-red/10 px-2.5 py-1 rounded border border-santic-red/20">
                                {draftTheme.typography.headingFontSize || 28}px
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-bold">16px</span>
                              <input
                                type="range"
                                min="16"
                                max="48"
                                step="1"
                                value={draftTheme.typography.headingFontSize || 28}
                                onChange={(e) =>
                                  updateTheme((prev) => ({
                                    ...prev,
                                    typography: { ...prev.typography, headingFontSize: Number(e.target.value) }
                                  }))
                                }
                                className="w-full accent-santic-red h-2 bg-slate-950 rounded-lg cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 font-bold">48px</span>
                            </div>
                          </div>

                          {/* 2. Paragraph & Body Font Size */}
                          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Paragraph & Body Font Size
                              </span>
                              <span className="font-mono text-xs font-extrabold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded border border-sky-400/20">
                                {draftTheme.typography.paragraphFontSize || 15}px
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-bold">11px</span>
                              <input
                                type="range"
                                min="11"
                                max="24"
                                step="1"
                                value={draftTheme.typography.paragraphFontSize || 15}
                                onChange={(e) =>
                                  updateTheme((prev) => ({
                                    ...prev,
                                    typography: { ...prev.typography, paragraphFontSize: Number(e.target.value) }
                                  }))
                                }
                                className="w-full accent-sky-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 font-bold">24px</span>
                            </div>
                          </div>

                          {/* 3. Navigation Menus Font Size */}
                          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Navigation Menus Font Size
                              </span>
                              <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                                {draftTheme.typography.menuFontSize || 14}px
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-bold">11px</span>
                              <input
                                type="range"
                                min="11"
                                max="22"
                                step="1"
                                value={draftTheme.typography.menuFontSize || 14}
                                onChange={(e) =>
                                  updateTheme((prev) => ({
                                    ...prev,
                                    typography: { ...prev.typography, menuFontSize: Number(e.target.value) }
                                  }))
                                }
                                className="w-full accent-amber-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 font-bold">22px</span>
                            </div>
                          </div>

                          {/* 4. Logo Branding Font Size */}
                          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Logo Branding Font Size
                              </span>
                              <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                                {draftTheme.typography.logoFontSize || 18}px
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-bold">12px</span>
                              <input
                                type="range"
                                min="12"
                                max="32"
                                step="1"
                                value={draftTheme.typography.logoFontSize || 18}
                                onChange={(e) =>
                                  updateTheme((prev) => ({
                                    ...prev,
                                    typography: { ...prev.typography, logoFontSize: Number(e.target.value) }
                                  }))
                                }
                                className="w-full accent-emerald-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 font-bold">32px</span>
                            </div>
                          </div>

                          {/* 5. Footer Headings Font Size */}
                          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Footer Section Headings Size
                              </span>
                              <span className="font-mono text-xs font-extrabold text-pink-400 bg-pink-400/10 px-2.5 py-1 rounded border border-pink-400/20">
                                {draftTheme.typography.footerHeadingFontSize || 13}px
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-bold">10px</span>
                              <input
                                type="range"
                                min="10"
                                max="24"
                                step="1"
                                value={draftTheme.typography.footerHeadingFontSize || 13}
                                onChange={(e) =>
                                  updateTheme((prev) => ({
                                    ...prev,
                                    typography: { ...prev.typography, footerHeadingFontSize: Number(e.target.value) }
                                  }))
                                }
                                className="w-full accent-pink-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 font-bold">24px</span>
                            </div>
                          </div>

                          {/* 6. Footer Text & Links Font Size */}
                          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Footer Text & Links Size
                              </span>
                              <span className="font-mono text-xs font-extrabold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded border border-teal-400/20">
                                {draftTheme.typography.footerBodyFontSize || 12}px
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-bold">9px</span>
                              <input
                                type="range"
                                min="9"
                                max="18"
                                step="1"
                                value={draftTheme.typography.footerBodyFontSize || 12}
                                onChange={(e) =>
                                  updateTheme((prev) => ({
                                    ...prev,
                                    typography: { ...prev.typography, footerBodyFontSize: Number(e.target.value) }
                                  }))
                                }
                                className="w-full accent-teal-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 font-bold">18px</span>
                            </div>
                          </div>
                        </div>

                        {/* 5. Global Base Font Size */}
                        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Global Base Root Font Size
                            </span>
                            <span className="font-mono text-xs font-extrabold text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded border border-purple-400/20">
                              {draftTheme.typography.baseFontSize}px
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-bold">12px</span>
                            <input
                              type="range"
                              min="12"
                              max="24"
                              step="1"
                              value={draftTheme.typography.baseFontSize}
                              onChange={(e) =>
                                updateTheme((prev) => ({
                                  ...prev,
                                  typography: { ...prev.typography, baseFontSize: Number(e.target.value) }
                                }))
                              }
                              className="w-full accent-purple-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-500 font-bold">24px</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: RADII & SPACING */}
                  {themeSubTab === 'radii' && (
                    <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Border Radius Configuration</h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.entries(draftTheme.radii).map(([key, val]) => (
                          <div key={key} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                            <span className="text-xs font-bold text-slate-400 capitalize block">{key} Radius</span>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                updateTheme((prev) => ({
                                  ...prev,
                                  radii: { ...prev.radii, [key]: e.target.value }
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 5: EXPORT CODE */}
                  {themeSubTab === 'code' && (
                    <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Generated CSS Variables</h3>
                        <button
                          onClick={() => handleCopyCode(generateCssVariables(draftTheme))}
                          className="bg-santic-red text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedCode ? 'Copied!' : 'Copy CSS'}</span>
                        </button>
                      </div>

                      <textarea
                        rows={12}
                        readOnly
                        value={generateCssVariables(draftTheme)}
                        className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 scrollbar-thin"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 3. CONTACT QUERIES & ANSWER SUPPORT DESK (MASTER-DETAIL VIEW) */}
              {/* ========================================================================= */}
              {activeNav === 'inquiries' && (
                <div className="space-y-6 animate-fade-in flex-1 flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        <Mail className="w-6 h-6 text-santic-red" />
                        <span>Secretariat Contact Queries Desk</span>
                      </h2>
                      <p className="text-xs text-slate-400">Review inquiries submitted by physical directors, principals, and student-athletes.</p>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search inquiries..."
                          value={inquirySearch}
                          onChange={(e) => setInquirySearch(e.target.value)}
                          className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {(['All', 'Pending', 'Answered'] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setInquiryFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                              inquiryFilter === filter
                                ? 'bg-santic-red text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Master-Detail Split Pane */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
                    
                    {/* Master List (Left Pane) */}
                    <div className="lg:col-span-5 bg-slate-950 rounded-3xl border border-slate-800 p-4 space-y-3 overflow-y-auto max-h-[600px] scrollbar-thin">
                      {filteredInquiries.length > 0 ? (
                        filteredInquiries.map((inq) => {
                          const isSelected = selectedInquiry?.id === inq.id;
                          return (
                            <div
                              key={inq.id}
                              onClick={() => setSelectedInquiryId(inq.id)}
                              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-santic-red/10 border-santic-red shadow-lg'
                                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-extrabold text-xs text-white truncate max-w-[200px]">{inq.name}</span>
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                    inq.status === 'Answered'
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-amber-500/20 text-amber-400 animate-pulse'
                                  }`}
                                >
                                  {inq.status}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-300 truncate">{inq.subject}</h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{inq.college || inq.email}</p>
                              <span className="text-[10px] font-mono text-slate-600 block mt-2">{inq.submittedAt}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-12 text-center text-slate-500 text-xs">
                          No contact inquiries match your filter.
                        </div>
                      )}
                    </div>

                    {/* Detail & Reply Panel (Right Pane) */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[600px] scrollbar-thin">
                      {selectedInquiry ? (
                        <>
                          <div className="space-y-6">
                            {/* Inquiry Sender Header */}
                            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-santic-red" />
                                  <h3 className="text-lg font-extrabold text-white">{selectedInquiry.name}</h3>
                                </div>
                                <p className="text-xs text-slate-400 flex items-center gap-2">
                                  <Building className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{selectedInquiry.college || 'Affiliated Institution'}</span>
                                </p>
                              </div>

                              <button
                                onClick={() => deleteContactInquiry(selectedInquiry.id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Contact Meta Badges */}
                            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block">Email Address</span>
                                <a href={`mailto:${selectedInquiry.email}`} className="text-santic-red font-bold hover:underline">
                                  {selectedInquiry.email}
                                </a>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block">Phone Number</span>
                                <a href={`tel:${selectedInquiry.phone}`} className="text-emerald-400 font-bold hover:underline">
                                  +91 {selectedInquiry.phone}
                                </a>
                              </div>
                            </div>

                            {/* Query Subject & Message */}
                            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <span className="text-xs font-extrabold text-white">Subject: {selectedInquiry.subject}</span>
                                <span className="text-[10px] font-mono text-slate-500">{selectedInquiry.submittedAt}</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                "{selectedInquiry.message}"
                              </p>
                            </div>

                            {/* Existing Reply if Answered */}
                            {selectedInquiry.replyText && (
                              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                                <div className="flex items-center justify-between text-xs font-extrabold text-emerald-400">
                                  <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Official Secretariat Response</span>
                                  </span>
                                  <span className="font-mono text-[10px]">{selectedInquiry.repliedAt}</span>
                                </div>
                                <p className="text-xs text-emerald-200 leading-relaxed">
                                  {selectedInquiry.replyText}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Reply Form */}
                          <form onSubmit={handleReplySubmit} className="pt-4 border-t border-slate-800 space-y-3">
                            <label className="block text-xs font-extrabold uppercase text-slate-300">
                              {selectedInquiry.status === 'Answered' ? 'Update Official Response' : 'Draft Official Reply'}
                            </label>
                            <textarea
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type official reply / confirmation message here..."
                              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white font-normal"
                              required
                            />
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="bg-santic-red hover:bg-santic-hoverRed text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-500/20"
                              >
                                <Send className="w-4 h-4" />
                                <span>{selectedInquiry.status === 'Answered' ? 'Update Reply' : 'Send Official Answer'}</span>
                              </button>
                            </div>
                          </form>
                        </>
                      ) : (
                        <div className="py-24 text-center text-slate-500 text-xs my-auto">
                          Select a contact inquiry from the left list to view details and send official responses.
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4. DOCUMENTS & CIRCULARS */}
              {/* ========================================================================= */}
              {activeNav === 'documents' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">Repository Documents ({documents.length})</h2>
                      <p className="text-xs text-slate-400">Upload, edit, delete, or feature PDF circulars and sports calendars on the Home Page News Marquee.</p>
                    </div>
                    <button
                      onClick={() => setShowAddDocAdmin(true)}
                      className="bg-santic-red hover:bg-santic-hoverRed text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload / Add New Document</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-santic-red/20 text-santic-red border border-santic-red/30">
                                {doc.category}
                              </span>
                              {doc.showOnNewsMarquee && (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-emerald-400" />
                                  <span>Home Marquee</span>
                                </span>
                              )}
                            </div>
                            <a
                              href={getDocumentPdfUrl(doc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-extrabold text-white hover:text-amber-300 transition-colors leading-snug cursor-pointer block"
                              title="Click to view PDF file in new window"
                            >
                              {doc.title}
                            </a>
                            <span className="text-[10px] font-mono text-slate-500 block">Date: {doc.date}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2 flex-wrap text-xs">
                          <div className="flex items-center gap-2">
                            <a
                              href={getDocumentPdfUrl(doc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-[11px] flex items-center gap-1 border border-slate-800"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View PDF</span>
                            </a>

                            <button
                              onClick={() => toggleDocumentNewsMarquee(doc.id)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all border ${
                                doc.showOnNewsMarquee
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                                  : 'bg-slate-900 hover:bg-santic-red text-slate-300 hover:text-white border-slate-800'
                              }`}
                              title={doc.showOnNewsMarquee ? 'Hide from Home Page Marquee' : 'Show on Home Page Marquee'}
                            >
                              {doc.showOnNewsMarquee ? 'Hide Marquee' : 'Show Marquee'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingDocAdmin({ ...doc })}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow-sm"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => deleteDocument(doc.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Document Modal inside Admin Portal */}
                  {showAddDocAdmin && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                      <div className="bg-slate-950 rounded-3xl max-w-lg w-full p-8 border border-slate-800 shadow-2xl space-y-4 text-white">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-lg font-extrabold text-white">Upload & Add New Document</h3>
                          <button onClick={() => setShowAddDocAdmin(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            addDocument({
                              title: addDocTitle,
                              category: addDocCategory,
                              academicYear: addDocAcademicYear || '2026-27',
                              date: addDocDate ? `${addDocDate} (${addDocAcademicYear || '2026-27'})` : (addDocAcademicYear || '2026-27'),
                              viewUrl: addDocUrl || '#',
                              downloadUrl: addDocUrl || '#'
                            });
                            setAddDocTitle('');
                            setAddDocUrl('');
                            setShowAddDocAdmin(false);
                          }}
                          className="space-y-4 text-xs font-bold"
                        >
                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Document Title</label>
                            <input
                              type="text"
                              value={addDocTitle}
                              onChange={(e) => setAddDocTitle(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                              placeholder="e.g. AIU Body Weight Implementation Order 2025-26"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Category</label>
                            <select
                              value={addDocCategory}
                              onChange={(e) => setAddDocCategory(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                            >
                              <option value="News">News</option>
                              <option value="Circulars">Circulars</option>
                              <option value="Souvenirs">Souvenirs</option>
                              <option value="Annual Reports - BOS&PE, SPPU, Pune">Annual Reports - BOS&PE, SPPU, Pune</option>
                              <option value="Sports Calendar - Intercollegiate">Sports Calendar - Intercollegiate</option>
                              <option value="Sports Calendar - Inter Zonal">Sports Calendar - Inter Zonal</option>
                              <option value="Draws">Draws</option>
                              <option value="Results">Results</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Academic Year (used for Yearwise Filtering & Sorting)</label>
                            <input
                              type="text"
                              value={addDocAcademicYear}
                              onChange={(e) => setAddDocAcademicYear(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                              placeholder="e.g. 2026-27"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Date / Year</label>
                            <input
                              type="date"
                              value={addDocDate}
                              onChange={(e) => setAddDocDate(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                              required
                            />
                          </div>

                          <FileUploadInput
                            sectionName="documents"
                            label="Upload PDF / Document File (Saved to uploads/documents/)"
                            currentUrl={addDocUrl}
                            onUrlChange={(url) => setAddDocUrl(url)}
                            accept=".pdf,.doc,.docx,image/*"
                          />

                          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                            <button type="button" onClick={() => setShowAddDocAdmin(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                            <button type="submit" className="bg-santic-red text-white px-6 py-2.5 rounded-xl font-extrabold uppercase">Save Document</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Edit Document Modal inside Admin Portal */}
                  {editingDocAdmin && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                      <div className="bg-slate-950 rounded-3xl max-w-lg w-full p-8 border border-slate-800 shadow-2xl space-y-4 text-white">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                            <Edit className="w-5 h-5 text-santic-red" />
                            <span>Edit Document Details</span>
                          </h3>
                          <button onClick={() => setEditingDocAdmin(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            editDocument(editingDocAdmin.id, {
                              title: editingDocAdmin.title,
                              category: editingDocAdmin.category,
                              date: editingDocAdmin.date,
                              viewUrl: editingDocAdmin.viewUrl,
                              downloadUrl: editingDocAdmin.viewUrl
                            });
                            setEditingDocAdmin(null);
                          }}
                          className="space-y-4 text-xs font-bold"
                        >
                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Document Title</label>
                            <input
                              type="text"
                              value={editingDocAdmin.title}
                              onChange={(e) => setEditingDocAdmin({ ...editingDocAdmin, title: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Category</label>
                            <select
                              value={editingDocAdmin.category}
                              onChange={(e) => setEditingDocAdmin({ ...editingDocAdmin, category: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                            >
                              <option value="News">News</option>
                              <option value="Circulars">Circulars</option>
                              <option value="Souvenirs">Souvenirs</option>
                              <option value="Annual Reports - BOS&PE, SPPU, Pune">Annual Reports - BOS&PE, SPPU, Pune</option>
                              <option value="Sports Calendar - Intercollegiate">Sports Calendar - Intercollegiate</option>
                              <option value="Sports Calendar - Inter Zonal">Sports Calendar - Inter Zonal</option>
                              <option value="Draws">Draws</option>
                              <option value="Results">Results</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Academic Year (used for Yearwise Filtering & Sorting)</label>
                            <input
                              type="text"
                              placeholder="e.g. 2026-27"
                              value={editingDocAdmin.academicYear || '2026-27'}
                              onChange={(e) => setEditingDocAdmin({ ...editingDocAdmin, academicYear: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1 uppercase">Date / Year</label>
                            <input
                              type="date"
                              value={editingDocAdmin.date}
                              onChange={(e) => setEditingDocAdmin({ ...editingDocAdmin, date: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                              required
                            />
                          </div>

                          <FileUploadInput
                            sectionName="documents"
                            label="Replace Document File (Saved to uploads/documents/)"
                            currentUrl={editingDocAdmin.viewUrl}
                            onUrlChange={(url) => setEditingDocAdmin({ ...editingDocAdmin, viewUrl: url, downloadUrl: url })}
                            accept=".pdf,.doc,.docx,image/*"
                          />

                          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                            <button type="button" onClick={() => setEditingDocAdmin(null)} className="px-4 py-2 text-slate-400">Cancel</button>
                            <button type="submit" className="bg-santic-red text-white px-6 py-2.5 rounded-xl font-extrabold uppercase">Update Document</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 5. GALLERY MANAGER */}
              {/* ========================================================================= */}
              {activeNav === 'gallery' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-2xl font-extrabold text-white">Photo & Video Gallery Media ({galleryItems.length})</h2>
                    <p className="text-xs text-slate-400">Manage photo cards and dynamic categories.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-2xl" />
                        <div className="space-y-1">
                          <span className="text-[10px] text-santic-red font-bold uppercase">{item.category}</span>
                          <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 6. SITE CMS SETTINGS */}
              {/* ========================================================================= */}
              {activeNav === 'cms' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-2xl font-extrabold text-white">Inline Site CMS Manager</h2>
                    <p className="text-xs text-slate-400">Click any block to open configuration dialogs.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { id: 'header', name: 'Header & Logo' },
                      { id: 'hero', name: 'Hero Slides' },
                      { id: 'news', name: 'News Marquee' },
                      { id: 'metrics', name: '4 Metrics' },
                      { id: 'vision', name: 'Vision & Mission' },
                      { id: 'footer', name: 'Footer & Copy' }
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveConfigTab(c.id as any)}
                        className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-santic-red text-left space-y-2 group transition-all"
                      >
                        <h4 className="text-sm font-extrabold text-white group-hover:text-santic-red transition-colors">{c.name}</h4>
                        <p className="text-xs text-slate-400">Click to configure inline options.</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 7. PCZSC COMMITTEE MANAGER */}
              {/* ========================================================================= */}
              {activeNav === 'committee' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">
                        PCZSC Committee Management ({committeeMembers.length})
                      </h2>
                      <p className="text-xs text-slate-400">
                        Add, edit, or remove Pune City Zonal Sports Committee executive members.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (window.confirm('Reset committee list to official 14 members?')) {
                            resetCommitteeMembers();
                            showToast('List Reset', 'Committee list restored to official 14 members.', 'info');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all shrink-0"
                      >
                        Reset Official List
                      </button>
                      <button
                        onClick={handleOpenAddCommitteeMember}
                        className="px-5 py-2.5 rounded-xl bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Committee Member</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Filter */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search committee members by name, designation, or college..."
                      value={committeeSearch}
                      onChange={(e) => setCommitteeSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-santic-red"
                    />
                  </div>

                  {/* Committee Table in Admin */}
                  {committeeMembers.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
                      <Users className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-medium">No committee members added yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs font-extrabold uppercase tracking-wider">
                            <th className="py-4 px-6 text-center">Photo</th>
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6">Designation</th>
                            <th className="py-4 px-6">College Address</th>
                            <th className="py-4 px-6">Contact Details</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                          {committeeMembers
                            .filter(
                              (m) =>
                                m.name.toLowerCase().includes(committeeSearch.toLowerCase()) ||
                                m.designation.toLowerCase().includes(committeeSearch.toLowerCase()) ||
                                m.collegeAddress.toLowerCase().includes(committeeSearch.toLowerCase())
                            )
                            .map((member) => (
                              <tr key={member.id} className="hover:bg-slate-900/60 transition-colors">
                                <td className="py-4 px-6 text-center">
                                  <div className="w-[170px] h-[170px] rounded-2xl overflow-hidden border-2 border-santic-red/30 shadow-md mx-auto bg-slate-900 shrink-0">
                                    <img
                                      src={member.photo}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-extrabold text-white whitespace-nowrap">
                                  {member.name}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-santic-red/20 text-santic-red border border-santic-red/30 whitespace-nowrap">
                                    {member.designation}
                                  </span>
                                </td>
                                <td className="py-4 px-6 max-w-xs text-[11px] text-slate-400 leading-relaxed">
                                  {member.collegeAddress}
                                </td>
                                <td className="py-4 px-6 text-[11px] text-slate-400">
                                  {member.contactDetails}
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenEditCommitteeMember(member)}
                                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                                      title="Edit Member"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCommitteeMember(member.id, member.name)}
                                      className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                      title="Delete Member"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Committee Member Add / Edit Modal */}
                  {showCommitteeModal && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl my-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-lg font-extrabold text-white">
                            {editingCommitteeMember ? 'Edit Committee Member' : 'Add New Committee Member'}
                          </h3>
                          <button
                            onClick={() => setShowCommitteeModal(false)}
                            className="p-1 rounded-full text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveCommitteeMember} className="space-y-4 text-xs">
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                            <input
                              type="text"
                              placeholder="e.g. Dr. Aftab Anwar Shaikh"
                              value={cmName}
                              onChange={(e) => setCmName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-santic-red"
                              required
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Designation *</label>
                            <input
                              type="text"
                              placeholder="e.g. President / Secretary / Member"
                              value={cmDesignation}
                              onChange={(e) => setCmDesignation(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-santic-red"
                              required
                            />
                          </div>

                          <FileUploadInput
                            sectionName="committee"
                            label="Photo (Upload image or paste URL)"
                            currentUrl={cmPhoto}
                            onUrlChange={(url) => setCmPhoto(url)}
                            accept="image/*"
                          />

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">College Address</label>
                            <textarea
                              rows={2}
                              placeholder="Enter complete college name and location address..."
                              value={cmCollegeAddress}
                              onChange={(e) => setCmCollegeAddress(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-santic-red"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Contact Details</label>
                            <input
                              type="text"
                              placeholder="e.g. Email: info@college.edu | Mobile: +91 98220 12345"
                              value={cmContactDetails}
                              onChange={(e) => setCmContactDetails(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-santic-red"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => setShowCommitteeModal(false)}
                              className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-santic-red hover:bg-santic-hoverRed text-white px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider"
                            >
                              {editingCommitteeMember ? 'Update Member' : 'Add Member'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 8. SEO & META TAGS MANAGEMENT TAB */}
              {/* ========================================================================= */}
              {activeNav === 'seo' && (
                <div className="space-y-8 animate-fade-in text-slate-900">
                  {/* Page Selector Bar */}
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                          <Globe className="w-5 h-5 text-sky-400" />
                          <span>Select Page to Manage SEO Settings</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Choose a website page below to edit its basic meta tags, social sharing cards, indexing rules, and sitemap settings.
                        </p>
                      </div>
                    </div>

                    {/* Page Selector Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                      {[
                        { key: 'home', name: 'Home Page', path: '/en/home' },
                        { key: 'about', name: 'About Us', path: '/en/about-us' },
                        { key: 'documents', name: 'Documents & Circulars', path: '/en/documents' },
                        { key: 'gallery', name: 'Photo & Video Gallery', path: '/en/gallery' },
                        { key: 'contact', name: 'Contact Us', path: '/en/contact-us' }
                      ].map((pg) => {
                        const isSelected = selectedSEOPage === pg.key;
                        return (
                          <button
                            key={pg.key}
                            type="button"
                            onClick={() => setSelectedSEOPage(pg.key)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all border ${
                              isSelected
                                ? 'bg-santic-red text-white border-santic-red shadow-lg shadow-red-500/20 scale-105'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{pg.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SEO Settings Multi-tab Form Component */}
                  <SEOSettingsForm pageKey={selectedSEOPage} />

                  {/* XML Sitemap & Robots.txt Output & Exporter */}
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-santic-yellow" />
                          <span>Generated XML Sitemap & Robots.txt Files</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Files are generated automatically and placed on the website root (<code className="text-santic-yellow">/sitemap.xml</code> and <code className="text-santic-yellow">/robots.txt</code>).
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const xml = generateXmlSitemap(seoStore);
                            navigator.clipboard.writeText(xml);
                            showToast('Copied to Clipboard', 'XML Sitemap copied to clipboard.', 'info');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Sitemap XML</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const xml = generateXmlSitemap(seoStore);
                            const blob = new Blob([xml], { type: 'application/xml' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'sitemap.xml';
                            a.click();
                            URL.revokeObjectURL(url);
                            showToast('Downloaded', 'sitemap.xml downloaded successfully.', 'success');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download sitemap.xml</span>
                        </button>
                      </div>
                    </div>

                    {/* Sitemap XML Live Code Block */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                        Live <code className="font-mono text-santic-yellow">sitemap.xml</code> Output:
                      </label>
                      <textarea
                        rows={8}
                        readOnly
                        value={generateXmlSitemap(seoStore)}
                        className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-santic-yellow font-mono text-xs focus:outline-none"
                      />
                    </div>

                    {/* Robots.txt Live Code Block */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                        Live <code className="font-mono text-santic-yellow">robots.txt</code> Output:
                      </label>
                      <textarea
                        rows={5}
                        readOnly
                        value={generateRobotsTxt(seoStore)}
                        className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-santic-yellow font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 9. MANAGE ADMINS (SUPER ADMIN ONLY) */}
              {/* ========================================================================= */}
              {activeNav === 'manage-admins' && isSuperAdmin && (
                <ManageAdminsSection />
              )}

            </section>
          </div>

        </div>
      </section>

      {activeConfigTab && (
        <AdminConfigModals
          activeTab={activeConfigTab}
          onClose={() => setActiveConfigTab(null)}
        />
      )}

      {showChangePassModal && (
        <ChangePasswordModal onClose={() => setShowChangePassModal(false)} />
      )}
    </main>
  );
};
