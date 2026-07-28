import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { PRESET_THEMES } from '../../../utils/themePresets';
import { FontFamily, PresetThemeId } from '../../../types/theme';
import { getWcagStatus, generateCssVariables, generateTailwindConfig } from '../../../utils/themeEngine';
import {
  Palette,
  Type as TypeIcon,
  Layout,
  Moon,
  Sun,
  RotateCcw,
  Undo,
  Redo,
  Download,
  Upload,
  Save,
  CheckCircle,
  Copy,
  Sliders,
  ShieldCheck,
  Eye,
  Code,
  Sparkles
} from 'lucide-react';

export const ThemeControlsSidebar: React.FC = () => {
  const {
    draftTheme,
    updateTheme,
    applyPreset,
    resetTheme,
    importThemeJson,
    exportThemeJsonString,
    publishTheme,
    saveTheme,
    duplicateTheme,
    undo,
    redo,
    canUndo,
    canRedo,
    isPublished,
    isCompareMode,
    toggleCompareMode,
    setDarkMode
  } = useTheme();

  const [activeTab, setActiveTab] = useState<
    'presets' | 'colors' | 'typography' | 'layout' | 'darkmode' | 'code'
  >('presets');

  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = importThemeJson(importText);
    if (ok) {
      setShowImportModal(false);
      setImportText('');
    } else {
      alert("Invalid Theme JSON format. Please check and try again.");
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const contrastStatus = getWcagStatus(
    draftTheme.textColors.primary,
    draftTheme.backgroundColors.body
  );

  return (
    <div className="w-full lg:w-96 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-hidden text-slate-200">
      
      {/* Top Header Actions */}
      <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-santic-red" />
            <h2 className="text-base font-extrabold text-white">Theme Editor Studio</h2>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo ? 'text-white hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo ? 'text-white hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Publish & Compare Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={publishTheme}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              isPublished
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-santic-red hover:bg-santic-hoverRed text-white hover:scale-105'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isPublished ? 'Published & Active' : 'Publish Theme'}</span>
          </button>

          <button
            onClick={toggleCompareMode}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              isCompareMode
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Side-by-Side Compare Mode"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Category Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 px-2 py-2 bg-slate-900/40 overflow-x-auto scrollbar-none">
        {[
          { id: 'presets', label: 'Presets', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'colors', label: 'Colors', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'typography', label: 'Fonts', icon: <TypeIcon className="w-3.5 h-3.5" /> },
          { id: 'layout', label: 'Layout', icon: <Layout className="w-3.5 h-3.5" /> },
          { id: 'darkmode', label: 'Mode & WCAG', icon: <Moon className="w-3.5 h-3.5" /> },
          { id: 'code', label: 'Export Code', icon: <Code className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-santic-red text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        
        {/* TAB 1: 10 PRESET THEMES */}
        {activeTab === 'presets' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                10 Built-in Presets
              </span>
              <button
                onClick={() => setShowImportModal(true)}
                className="text-[11px] font-bold text-santic-red hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Import JSON</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.values(PRESET_THEMES).map((preset) => (
                <button
                  key={preset.presetId}
                  onClick={() => applyPreset(preset.presetId as PresetThemeId)}
                  className={`p-3 rounded-2xl border text-left space-y-2 transition-all hover:scale-105 ${
                    draftTheme.presetId === preset.presetId
                      ? 'bg-santic-red/10 border-santic-red shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Mini Color Swatch Bar */}
                  <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full flex-1" style={{ backgroundColor: preset.primaryColors.primary }} />
                    <div className="h-full flex-1" style={{ backgroundColor: preset.backgroundColors.body }} />
                    <div className="h-full flex-1" style={{ backgroundColor: preset.backgroundColors.card }} />
                    <div className="h-full flex-1" style={{ backgroundColor: preset.textColors.primary }} />
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-white truncate">{preset.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={resetTheme}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                <span>Reset Default</span>
              </button>

              <button
                onClick={duplicateTheme}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Duplicate Theme</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: COLOR EDITOR */}
        {activeTab === 'colors' && (
          <div className="space-y-6 animate-fade-in text-xs font-bold">
            {/* Primary Palette */}
            <div className="space-y-3">
              <h4 className="text-[11px] text-slate-400 uppercase tracking-wider">Primary Palette</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(draftTheme.primaryColors).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="capitalize text-slate-300">{key}</span>
                    <input
                      type="color"
                      value={val}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          primaryColors: { ...prev.primaryColors, [key]: e.target.value }
                        }))
                      }
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Background Colors */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-[11px] text-slate-400 uppercase tracking-wider">Background Colors</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(draftTheme.backgroundColors).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="capitalize text-slate-300">{key}</span>
                    <input
                      type="color"
                      value={val}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          backgroundColors: { ...prev.backgroundColors, [key]: e.target.value }
                        }))
                      }
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TYPOGRAPHY */}
        {activeTab === 'typography' && (
          <div className="space-y-6 animate-fade-in text-xs font-bold">
            <div>
              <label className="block text-slate-400 uppercase tracking-wider mb-2">Body Font (Google Fonts)</label>
              <select
                value={draftTheme.typography.bodyFont}
                onChange={(e) =>
                  updateTheme((prev) => ({
                    ...prev,
                    typography: { ...prev.typography, bodyFont: e.target.value as FontFamily }
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
              >
                {googleFonts.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 uppercase tracking-wider mb-2">Heading Font (Google Fonts)</label>
              <select
                value={draftTheme.typography.headingFont}
                onChange={(e) =>
                  updateTheme((prev) => ({
                    ...prev,
                    typography: { ...prev.typography, headingFont: e.target.value as FontFamily }
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
              >
                {googleFonts.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Base Font Size Slider */}
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span>Base Font Size</span>
                <span className="font-mono text-santic-red">{draftTheme.typography.baseFontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="22"
                value={draftTheme.typography.baseFontSize}
                onChange={(e) =>
                  updateTheme((prev) => ({
                    ...prev,
                    typography: { ...prev.typography, baseFontSize: Number(e.target.value) }
                  }))
                }
                className="w-full accent-santic-red cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 4: LAYOUT & RADII */}
        {activeTab === 'layout' && (
          <div className="space-y-6 animate-fade-in text-xs font-bold">
            <h4 className="text-[11px] text-slate-400 uppercase tracking-wider">Border Radii Settings</h4>

            <div className="space-y-4">
              {Object.entries(draftTheme.radii).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="capitalize">{key} Radius</span>
                    <span className="font-mono text-santic-red">{val}</span>
                  </div>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) =>
                      updateTheme((prev) => ({
                        ...prev,
                        radii: { ...prev.radii, [key]: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DARK MODE & ACCESSIBILITY */}
        {activeTab === 'darkmode' && (
          <div className="space-y-6 animate-fade-in text-xs font-bold">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-slate-400 uppercase tracking-wider block">Mode Selection</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    !draftTheme.darkMode.isDark
                      ? 'bg-white text-slate-900 border-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </button>

                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    draftTheme.darkMode.isDark
                      ? 'bg-slate-800 text-white border-santic-red shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* WCAG AA Contrast Audit */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">WCAG AA Contrast Checker</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-slate-400 font-mono text-sm">
                <span>Contrast Ratio:</span>
                <span className="font-bold text-white">{contrastStatus.ratio}:1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${contrastStatus.passAA ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {contrastStatus.passAA ? 'PASS (AA compliant)' : 'FAIL (Low Contrast)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EXPORT CODE */}
        {activeTab === 'code' && (
          <div className="space-y-4 animate-fade-in text-xs font-bold">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase tracking-wider">CSS Variables & Tailwind</span>
              <button
                onClick={() => handleCopyCode(generateCssVariables(draftTheme))}
                className="text-[11px] font-bold text-santic-red hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCode ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>

            <textarea
              rows={12}
              readOnly
              value={generateCssVariables(draftTheme)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 scrollbar-thin"
            />
          </div>
        )}

      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 space-y-4 text-white">
            <h3 className="text-sm font-extrabold uppercase">Import Theme JSON</h3>
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste Theme JSON object here..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono"
                required
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowImportModal(false)} className="text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="bg-santic-red text-white px-5 py-2 rounded-xl text-xs font-extrabold uppercase">
                  Apply Theme JSON
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
