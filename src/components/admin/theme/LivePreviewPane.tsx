import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Sliders,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info as InfoIcon,
  Search,
  Download,
  Eye,
  Plus,
  ChevronDown,
  User,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';

export const LivePreviewPane: React.FC = () => {
  const { draftTheme, currentTheme, isCompareMode } = useTheme();
  const [activePreviewTab, setActivePreviewTab] = useState<
    'dashboard' | 'buttons' | 'forms' | 'tables' | 'alerts' | 'navigation'
  >('dashboard');

  const [selectedTab, setSelectedTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [switchState, setSwitchState] = useState(true);

  const previewTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'buttons', label: 'Buttons & Badges', icon: <Layers className="w-4 h-4" /> },
    { id: 'forms', label: 'Forms & Inputs', icon: <Sliders className="w-4 h-4" /> },
    { id: 'tables', label: 'Tables & Pagination', icon: <FileText className="w-4 h-4" /> },
    { id: 'alerts', label: 'Cards & Alerts', icon: <Bell className="w-4 h-4" /> }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Live Preview Header Bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Interactive Live Preview</span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Active Theme: <strong className="text-white">{draftTheme.name}</strong>
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {previewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePreviewTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePreviewTab === tab.id
                  ? 'bg-santic-red text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
        
        {/* If Compare Mode is Active: Side-by-side comparison */}
        {isCompareMode && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Comparing <strong>Before (Published)</strong> vs <strong>After (Draft Preview)</strong></span>
            </div>
            <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">Compare Mode Active</span>
          </div>
        )}

        {/* 1. DASHBOARD OVERVIEW PREVIEW */}
        {activePreviewTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Student Athletes', value: '3,420+', change: '+14%', color: draftTheme.primaryColors.primary },
                { label: 'Intercollegiate Events', value: '124', change: '+8%', color: draftTheme.primaryColors.success },
                { label: 'Affiliated Colleges', value: '64', change: '100%', color: draftTheme.primaryColors.info },
                { label: 'Live Stream Views', value: '45.2K', change: '+32%', color: draftTheme.primaryColors.warning }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border shadow-lg space-y-2 transition-transform hover:-translate-y-1"
                  style={{
                    backgroundColor: draftTheme.backgroundColors.card,
                    borderColor: draftTheme.borderColors.normal,
                    borderRadius: draftTheme.radii.card
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold" style={{ color: draftTheme.textColors.muted }}>
                    <span>{card.label}</span>
                    <TrendingUp className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                  <div className="text-3xl font-black font-numeric" style={{ color: draftTheme.textColors.heading }}>
                    {card.value}
                  </div>
                  <div className="text-[11px] font-bold" style={{ color: card.color }}>
                    {card.change} from previous year
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Table & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className="lg:col-span-8 p-6 rounded-2xl border shadow-md space-y-4"
                style={{
                  backgroundColor: draftTheme.backgroundColors.card,
                  borderColor: draftTheme.borderColors.normal,
                  borderRadius: draftTheme.radii.card
                }}
              >
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: draftTheme.borderColors.divider }}>
                  <h3 className="text-base font-extrabold" style={{ color: draftTheme.textColors.heading }}>
                    Recent Circulars & Championships
                  </h3>
                  <button
                    className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: draftTheme.primaryColors.primary, borderRadius: draftTheme.radii.button }}
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Minimum Qualifying Standard 2025-26 Released', date: 'Sept 27, 2025', tag: 'Circular', status: 'Published' },
                    { title: 'AIU Implementation of New Body Weight Category', date: 'Oct 03, 2025', tag: 'Notice', status: 'Active' },
                    { title: 'Intercollegiate Athletics Championship Fixtures', date: 'Jul 15, 2024', tag: 'Draws', status: 'Completed' }
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors"
                      style={{
                        backgroundColor: draftTheme.backgroundColors.section,
                        borderColor: draftTheme.borderColors.normal
                      }}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded" style={{ backgroundColor: draftTheme.primaryColors.primary + '20', color: draftTheme.primaryColors.primary }}>
                          {row.tag}
                        </span>
                        <h4 className="text-xs font-bold" style={{ color: draftTheme.textColors.primary }}>
                          {row.title}
                        </h4>
                      </div>
                      <span className="text-xs font-mono shrink-0" style={{ color: draftTheme.textColors.muted }}>
                        {row.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Info Card */}
              <div
                className="lg:col-span-4 p-6 rounded-2xl border shadow-md space-y-4"
                style={{
                  backgroundColor: draftTheme.backgroundColors.sidebar,
                  borderColor: draftTheme.borderColors.normal,
                  borderRadius: draftTheme.radii.card
                }}
              >
                <div className="flex items-center gap-2 text-santic-red">
                  <Award className="w-5 h-5" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">PCZSC Governance</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authorized body under Savitribai Phule Pune University (SPPU) planning, coordinating, and managing intercollegiate sports.
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Theme Architecture</span>
                  <span className="font-mono font-bold text-emerald-400">WCAG AA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BUTTONS & BADGES PREVIEW */}
        {activePreviewTab === 'buttons' && (
          <div className="space-y-8 animate-fade-in">
            {/* Button Styles */}
            <div
              className="p-6 rounded-2xl border space-y-6"
              style={{
                backgroundColor: draftTheme.backgroundColors.card,
                borderColor: draftTheme.borderColors.normal,
                borderRadius: draftTheme.radii.card
              }}
            >
              <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: draftTheme.textColors.heading }}>
                Button Variants & Hover States
              </h3>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{ backgroundColor: draftTheme.primaryColors.primary, borderRadius: draftTheme.radii.button }}
                >
                  Primary Button
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{ backgroundColor: draftTheme.primaryColors.secondary, borderRadius: draftTheme.radii.button }}
                >
                  Secondary Button
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border transition-all hover:scale-105"
                  style={{
                    borderColor: draftTheme.primaryColors.primary,
                    color: draftTheme.primaryColors.primary,
                    borderRadius: draftTheme.radii.button
                  }}
                >
                  Outline Button
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{ backgroundColor: draftTheme.primaryColors.success, borderRadius: draftTheme.radii.button }}
                >
                  Success Button
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{ backgroundColor: draftTheme.primaryColors.warning, borderRadius: draftTheme.radii.button }}
                >
                  Warning Button
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{ backgroundColor: draftTheme.primaryColors.danger, borderRadius: draftTheme.radii.button }}
                >
                  Danger Button
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold opacity-50 cursor-not-allowed"
                  style={{ backgroundColor: draftTheme.textColors.disabled, borderRadius: draftTheme.radii.button }}
                  disabled
                >
                  Disabled Button
                </button>
              </div>
            </div>

            {/* Badges Section */}
            <div
              className="p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: draftTheme.backgroundColors.card,
                borderColor: draftTheme.borderColors.normal,
                borderRadius: draftTheme.radii.card
              }}
            >
              <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: draftTheme.textColors.heading }}>
                Status Badges & Chips
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: 'Primary Badge', bg: draftTheme.primaryColors.primary },
                  { label: 'Secondary Badge', bg: draftTheme.primaryColors.secondary },
                  { label: 'Success Active', bg: draftTheme.primaryColors.success },
                  { label: 'Warning Notice', bg: draftTheme.primaryColors.warning },
                  { label: 'Danger Error', bg: draftTheme.primaryColors.danger },
                  { label: 'Info Update', bg: draftTheme.primaryColors.info }
                ].map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-sm uppercase tracking-wider"
                    style={{ backgroundColor: badge.bg }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. FORMS & INPUTS PREVIEW */}
        {activePreviewTab === 'forms' && (
          <div className="space-y-6 animate-fade-in">
            <div
              className="p-6 rounded-2xl border space-y-6"
              style={{
                backgroundColor: draftTheme.backgroundColors.card,
                borderColor: draftTheme.borderColors.normal,
                borderRadius: draftTheme.radii.card
              }}
            >
              <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: draftTheme.textColors.heading }}>
                Form Controls & Interactive Inputs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: draftTheme.textColors.primary }}>
                    Full Name Field
                  </label>
                  <input
                    type="text"
                    defaultValue="Dr. Shaikh Aiyaz Hussain"
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none"
                    style={{
                      backgroundColor: draftTheme.backgroundColors.page,
                      borderColor: draftTheme.borderColors.normal,
                      color: draftTheme.textColors.primary,
                      borderRadius: draftTheme.radii.input
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: draftTheme.textColors.primary }}>
                    Category Selector
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none"
                    style={{
                      backgroundColor: draftTheme.backgroundColors.page,
                      borderColor: draftTheme.borderColors.normal,
                      color: draftTheme.textColors.primary,
                      borderRadius: draftTheme.radii.input
                    }}
                  >
                    <option>Circulars</option>
                    <option>Sports Calendar - Intercollegiate</option>
                    <option>Annual Reports - BOS&PE</option>
                    <option>Souvenirs</option>
                  </select>
                </div>
              </div>

              {/* Toggle Switch & Checkbox */}
              <div className="flex items-center gap-8 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setSwitchState(!switchState)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      switchState ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        switchState ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold" style={{ color: draftTheme.textColors.primary }}>
                    Enable Auto Live Streaming
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-santic-red" />
                  <span className="text-xs font-bold" style={{ color: draftTheme.textColors.primary }}>
                    Accept Terms & Conditions
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 4. TABLES & PAGINATION PREVIEW */}
        {activePreviewTab === 'tables' && (
          <div className="space-y-6 animate-fade-in">
            <div
              className="p-6 rounded-2xl border space-y-4 overflow-hidden"
              style={{
                backgroundColor: draftTheme.backgroundColors.card,
                borderColor: draftTheme.borderColors.normal,
                borderRadius: draftTheme.radii.card
              }}
            >
              <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: draftTheme.textColors.heading }}>
                Data Table with Sorting & Action Badges
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr
                      className="border-b uppercase font-bold"
                      style={{
                        backgroundColor: draftTheme.backgroundColors.sidebar,
                        color: '#ffffff',
                        borderColor: draftTheme.borderColors.divider
                      }}
                    >
                      <th className="py-3 px-4">Sr. No.</th>
                      <th className="py-3 px-4">Document Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: draftTheme.borderColors.divider }}>
                    {[
                      { sr: 1, title: 'AIU Order - Body Weight Category 2025-26', category: 'Circulars', date: '2025-10-03' },
                      { sr: 2, title: 'Minimum Qualifying Standard 2025-26', category: 'Circulars', date: '2025-09-27' },
                      { sr: 3, title: 'PCZSC Intercollegiate Sports Calendar', category: 'Sports Calendar', date: '2024-07-15' }
                    ].map((row) => (
                      <tr key={row.sr} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold font-mono text-slate-400">{row.sr}</td>
                        <td className="py-3 px-4 font-bold" style={{ color: draftTheme.textColors.primary }}>{row.title}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: draftTheme.primaryColors.primary + '20', color: draftTheme.primaryColors.primary }}>
                            {row.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{row.date}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1 rounded hover:bg-slate-800 text-slate-300">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 rounded hover:bg-slate-800 text-santic-red">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. CARDS & ALERTS PREVIEW */}
        {activePreviewTab === 'alerts' && (
          <div className="space-y-6 animate-fade-in">
            {/* System Alerts */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl border flex items-start gap-3 bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Success Alert</h4>
                  <p className="text-xs text-emerald-300/90 font-normal">
                    Theme changes have been previewed successfully. Click "Publish Theme" to apply globally.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border flex items-start gap-3 bg-amber-500/10 border-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Warning Notice</h4>
                  <p className="text-xs text-amber-300/90 font-normal">
                    Ensure contrast ratio passes WCAG AA standards for optimal readability.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border flex items-start gap-3 bg-rose-500/10 border-rose-500/20 text-rose-400">
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Danger Alert</h4>
                  <p className="text-xs text-rose-300/90 font-normal">
                    Failed to connect to background database server. Retrying...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
