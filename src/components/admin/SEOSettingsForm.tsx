import React, { useState, useEffect } from 'react';
import { PageSEOConfig } from '../../types/seo';
import { useCMS } from '../../context/CMSContext';
import { FileUploadInput } from '../FileUploadInput';
import { useToast } from '../../context/ToastContext';
import { formatRobotsMetaTag } from '../../utils/sitemapGenerator';
import {
  Globe,
  Search,
  Share2,
  Twitter,
  FileCode,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  RotateCcw,
  Save,
  Link,
  Code,
  Shield,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Smartphone,
  Star,
  Info
} from 'lucide-react';

interface SEOSettingsFormProps {
  pageKey: string;
  onSaved?: () => void;
}

const defaultFaviconState = {
  faviconUrl: '/favicon.ico',
  favicon32Url: '/favicon-32x32.png',
  favicon16Url: '/favicon-16x16.png',
  appleTouchIconUrl: '/apple-touch-icon.png',
  manifestUrl: '/site.webmanifest'
};

export const SEOSettingsForm: React.FC<SEOSettingsFormProps> = ({ pageKey, onSaved }) => {
  const { seoStore, updatePageSEO, resetPageSEO } = useCMS();
  const { showToast } = useToast();

  const currentConfig: PageSEOConfig = seoStore[pageKey] || {
    pageKey,
    pageName: pageKey,
    pagePath: `/en/${pageKey}`,
    basic: { metaTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '' },
    robots: { index: true, follow: true, noArchive: false, noSnippet: false },
    og: { ogTitle: '', ogDescription: '', ogImage: '', ogUrl: '', ogType: 'website' },
    twitter: { cardType: 'summary_large_image', twitterTitle: '', twitterDescription: '', twitterImage: '' },
    sitemap: { includeInSitemap: true, priority: 0.8, changeFreq: 'weekly' },
    favicon: { ...defaultFaviconState },
    additional: { author: '', language: 'en', themeColor: '#d97706', customHeadTags: '' }
  };

  // Ensure favicon state is present
  const mergedConfig: PageSEOConfig = {
    ...currentConfig,
    favicon: currentConfig.favicon ? { ...defaultFaviconState, ...currentConfig.favicon } : { ...defaultFaviconState }
  };

  const [form, setForm] = useState<PageSEOConfig>(mergedConfig);
  const [activeTab, setActiveTab] = useState<'basic' | 'robots' | 'og' | 'twitter' | 'favicon' | 'sitemap' | 'advanced'>('basic');

  useEffect(() => {
    if (seoStore[pageKey]) {
      const cfg = seoStore[pageKey];
      setForm({
        ...cfg,
        favicon: cfg.favicon ? { ...defaultFaviconState, ...cfg.favicon } : { ...defaultFaviconState }
      });
    }
  }, [pageKey, seoStore]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePageSEO(pageKey, form);
    showToast(
      'SEO Settings Saved',
      `Successfully updated SEO, favicons, and metadata settings for ${form.pageName || pageKey}.`,
      'success'
    );
    if (onSaved) onSaved();
  };

  const handleResetDefaults = () => {
    if (window.confirm(`Reset SEO settings for ${form.pageName} to original defaults?`)) {
      resetPageSEO(pageKey);
      showToast('Reset to Defaults', `SEO settings for ${form.pageName} restored to defaults.`, 'info');
    }
  };

  const handleInheritOG = () => {
    setForm((prev) => ({
      ...prev,
      og: {
        ...prev.og,
        ogTitle: prev.basic.metaTitle || prev.og.ogTitle,
        ogDescription: prev.basic.metaDescription || prev.og.ogDescription,
        ogUrl: prev.basic.canonicalUrl || prev.og.ogUrl || `https://pczsc.in${prev.pagePath}`
      }
    }));
    showToast('Inherited Values', 'Copied Meta Title & Description to Open Graph tags.', 'info');
  };

  const handleInheritTwitter = () => {
    setForm((prev) => ({
      ...prev,
      twitter: {
        ...prev.twitter,
        twitterTitle: prev.og.ogTitle || prev.basic.metaTitle || prev.twitter.twitterTitle,
        twitterDescription: prev.og.ogDescription || prev.basic.metaDescription || prev.twitter.twitterDescription,
        twitterImage: prev.og.ogImage || prev.twitter.twitterImage
      }
    }));
    showToast('Inherited Values', 'Copied Open Graph values to Twitter Card fields.', 'info');
  };

  // Helper calculation for title & description counters
  const titleLength = form.basic.metaTitle.length;
  const descLength = form.basic.metaDescription.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { label: 'Empty', color: 'bg-slate-200 text-slate-600' };
    if (titleLength < 30) return { label: 'Too short', color: 'bg-amber-100 text-amber-700 border-amber-300' };
    if (titleLength <= 60) return { label: 'Optimal length (30-60)', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    return { label: 'Too long (>60)', color: 'bg-red-100 text-red-700 border-red-300' };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { label: 'Empty', color: 'bg-slate-200 text-slate-600' };
    if (descLength < 70) return { label: 'Too short', color: 'bg-amber-100 text-amber-700 border-amber-300' };
    if (descLength <= 160) return { label: 'Optimal length (70-160)', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    return { label: 'Too long (>160)', color: 'bg-red-100 text-red-700 border-red-300' };
  };

  const effectiveRobots = formatRobotsMetaTag(form.robots);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <Globe className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-santic-red/20 border border-santic-red/40 text-santic-red text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>SEO, Favicon & Metadata Management</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            SEO Settings for <span className="text-santic-yellow">{form.pageName}</span>
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1">
            Path: <code className="bg-slate-800 px-2 py-0.5 rounded text-santic-yellow font-mono">{form.pagePath}</code>
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-red-500/20 uppercase tracking-wider transition-all scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tabs & Form, Right Real-time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'basic' ? 'bg-white text-santic-red shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>1. Basic Meta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('robots')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'robots' ? 'bg-white text-santic-red shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>2. Robots</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('og')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'og' ? 'bg-white text-santic-red shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>3. Open Graph</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('twitter')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'twitter' ? 'bg-white text-santic-red shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>4. Twitter/X</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favicon')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'favicon' ? 'bg-white text-santic-red shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>5. Favicon & Icons</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sitemap')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'sitemap' ? 'bg-white text-santic-red shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>6. Sitemap</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'advanced' ? 'bg-white text-santic-red shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>7. Advanced</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
            
            {/* TAB 1: BASIC META TAGS */}
            {activeTab === 'basic' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Search className="w-4 h-4 text-santic-red" />
                    <span>Basic Meta Tags</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Essential title, description, keywords, and canonical link used by search engine crawlers.
                  </p>
                </div>

                {/* Meta Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Meta Title <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getTitleStatus().color}`}>
                      {titleLength} chars | {getTitleStatus().label}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={form.basic.metaTitle}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        basic: { ...prev.basic, metaTitle: e.target.value }
                      }))
                    }
                    placeholder="e.g., PCZSC - Pune City Zonal Sports Committee | Official Portal"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                  />
                  <p className="text-[11px] text-slate-500">
                    Appears as the main blue link title in Google search results and browser tab. Recommended length: 50-60 characters.
                  </p>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Meta Description <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getDescStatus().color}`}>
                      {descLength} chars | {getDescStatus().label}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={form.basic.metaDescription}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        basic: { ...prev.basic, metaDescription: e.target.value }
                      }))
                    }
                    placeholder="Write a concise, compelling summary of the page for search engine users..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                  />
                  <p className="text-[11px] text-slate-500">
                    Appears below the title in search results. Recommended length: 150-160 characters.
                  </p>
                </div>

                {/* Meta Keywords */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Meta Keywords (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.basic.metaKeywords}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        basic: { ...prev.basic, metaKeywords: e.target.value }
                      }))
                    }
                    placeholder="Comma-separated keywords, e.g., PCZSC, Pune Sports, SPPU, Collegiate Championships"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                  />
                  <p className="text-[11px] text-slate-500">
                    Optional list of key phrases relevant to this page.
                  </p>
                </div>

                {/* Canonical URL */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Canonical URL
                  </label>
                  <div className="relative">
                    <Link className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={form.basic.canonicalUrl}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          basic: { ...prev.basic, canonicalUrl: e.target.value }
                        }))
                      }
                      placeholder={`https://pczsc.in${form.pagePath}`}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Defines the authoritative preferred URL version of this page to prevent duplicate content issues.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ROBOTS META TAGS */}
            {activeTab === 'robots' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-santic-red" />
                    <span>Robots Meta Directives</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Controls how search engine robots crawl, index, and archive this page.
                  </p>
                </div>

                {/* Generated Meta Tag Banner */}
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Generated HTML Tag:
                  </span>
                  <div className="font-mono text-xs text-santic-yellow font-bold">
                    {`<meta name="robots" content="${effectiveRobots}" />`}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Index / NoIndex */}
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50">
                    <input
                      type="checkbox"
                      checked={form.robots.index}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          robots: { ...prev.robots, index: e.target.checked }
                        }))
                      }
                      className="mt-0.5 rounded text-santic-red focus:ring-santic-red w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        Index Page (index)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                        Allow search engines to index and display this page in search results.
                      </span>
                    </div>
                  </label>

                  {/* Follow / NoFollow */}
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50">
                    <input
                      type="checkbox"
                      checked={form.robots.follow}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          robots: { ...prev.robots, follow: e.target.checked }
                        }))
                      }
                      className="mt-0.5 rounded text-santic-red focus:ring-santic-red w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        Follow Links (follow)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                        Allow search engines to follow outbound links on this page.
                      </span>
                    </div>
                  </label>

                  {/* No Archive */}
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50">
                    <input
                      type="checkbox"
                      checked={form.robots.noArchive}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          robots: { ...prev.robots, noArchive: e.target.checked }
                        }))
                      }
                      className="mt-0.5 rounded text-santic-red focus:ring-santic-red w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        No Archive (noarchive)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                        Prevent search engines from storing a cached copy of this page.
                      </span>
                    </div>
                  </label>

                  {/* No Snippet */}
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50">
                    <input
                      type="checkbox"
                      checked={form.robots.noSnippet}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          robots: { ...prev.robots, noSnippet: e.target.checked }
                        }))
                      }
                      className="mt-0.5 rounded text-santic-red focus:ring-santic-red w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        No Snippet (nosnippet)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                        Do not show a text snippet or video preview in search results.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: OPEN GRAPH (SOCIAL MEDIA) */}
            {activeTab === 'og' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-santic-red" />
                      <span>Open Graph (Social Sharing)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Metadata used when link is shared on Facebook, LinkedIn, WhatsApp, and Telegram.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleInheritOG}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-santic-red" />
                    <span>Copy Basic Meta</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* OG Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={form.og.ogTitle}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          og: { ...prev.og, ogTitle: e.target.value }
                        }))
                      }
                      placeholder={form.basic.metaTitle || 'Title for social media shares'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>

                  {/* OG Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      OG Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.og.ogDescription}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          og: { ...prev.og, ogDescription: e.target.value }
                        }))
                      }
                      placeholder={form.basic.metaDescription || 'Description for social media cards'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>

                  {/* OG Image */}
                  <div className="space-y-2">
                    <FileUploadInput
                      sectionName="social"
                      label="OG Featured Image (1200x630 recommended)"
                      currentUrl={form.og.ogImage}
                      onUrlChange={(url: string) =>
                        setForm((prev) => ({
                          ...prev,
                          og: { ...prev.og, ogImage: url }
                        }))
                      }
                      accept="image/*"
                    />
                  </div>

                  {/* OG URL & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        OG URL
                      </label>
                      <input
                        type="url"
                        value={form.og.ogUrl}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            og: { ...prev.og, ogUrl: e.target.value }
                          }))
                        }
                        placeholder={form.basic.canonicalUrl || `https://pczsc.in${form.pagePath}`}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        OG Type
                      </label>
                      <select
                        value={form.og.ogType}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            og: { ...prev.og, ogType: e.target.value }
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm bg-white"
                      >
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="organization">organization</option>
                        <option value="profile">profile</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TWITTER / X CARDS */}
            {activeTab === 'twitter' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-santic-red" />
                      <span>Twitter / X Card Metadata</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configures preview card appearance when link is posted on Twitter / X.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleInheritTwitter}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-santic-red" />
                    <span>Copy Open Graph</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Card Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Twitter Card Type
                    </label>
                    <select
                      value={form.twitter.cardType}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, cardType: e.target.value as any }
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm bg-white"
                    >
                      <option value="summary_large_image">Summary Card with Large Image (summary_large_image)</option>
                      <option value="summary">Standard Summary Card (summary)</option>
                    </select>
                  </div>

                  {/* Twitter Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Twitter Title
                    </label>
                    <input
                      type="text"
                      value={form.twitter.twitterTitle}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, twitterTitle: e.target.value }
                        }))
                      }
                      placeholder={form.og.ogTitle || form.basic.metaTitle || 'Title for Twitter card'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>

                  {/* Twitter Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Twitter Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.twitter.twitterDescription}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, twitterDescription: e.target.value }
                        }))
                      }
                      placeholder={form.og.ogDescription || form.basic.metaDescription || 'Description for Twitter card'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>

                  {/* Twitter Image */}
                  <div className="space-y-2">
                    <FileUploadInput
                      sectionName="social"
                      label="Twitter Card Image"
                      currentUrl={form.twitter.twitterImage}
                      onUrlChange={(url: string) =>
                        setForm((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, twitterImage: url }
                        }))
                      }
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: FAVICON & APP ICONS */}
            {activeTab === 'favicon' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Favicon & App Icon Management</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload icons displayed on browser tabs, bookmarks, mobile homescreens, and progressive web apps.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Primary Favicon */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                      Primary Website Favicon (.ico / .png / .svg)
                    </span>
                    <FileUploadInput
                      sectionName="favicon"
                      label="Upload Main Favicon Icon"
                      currentUrl={form.favicon.faviconUrl}
                      onUrlChange={(url: string) =>
                        setForm((prev) => ({
                          ...prev,
                          favicon: { ...prev.favicon, faviconUrl: url }
                        }))
                      }
                      accept="image/x-icon,image/png,image/svg+xml"
                    />
                    <p className="text-[11px] text-slate-500">
                      Standard icon displayed in browser address bar and tabs. (Recommended: 32x32 `.ico` or SVG).
                    </p>
                  </div>

                  {/* Apple Touch Icon */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-slate-700" />
                      <span>Apple Touch Icon (iOS Homescreen - 180x180 PNG)</span>
                    </span>
                    <FileUploadInput
                      sectionName="favicon"
                      label="Upload Apple Touch Icon (180x180 PNG)"
                      currentUrl={form.favicon.appleTouchIconUrl}
                      onUrlChange={(url: string) =>
                        setForm((prev) => ({
                          ...prev,
                          favicon: { ...prev.favicon, appleTouchIconUrl: url }
                        }))
                      }
                      accept="image/png"
                    />
                    <p className="text-[11px] text-slate-500">
                      High-resolution PNG icon used when users add this website to iPhone/iPad homescreen.
                    </p>
                  </div>

                  {/* 32x32 & 16x16 PNG Icons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                        32x32 PNG Favicon
                      </span>
                      <FileUploadInput
                        sectionName="favicon"
                        label="Upload 32x32 PNG Icon"
                        currentUrl={form.favicon.favicon32Url}
                        onUrlChange={(url: string) =>
                          setForm((prev) => ({
                            ...prev,
                            favicon: { ...prev.favicon, favicon32Url: url }
                          }))
                        }
                        accept="image/png"
                      />
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                        16x16 PNG Favicon
                      </span>
                      <FileUploadInput
                        sectionName="favicon"
                        label="Upload 16x16 PNG Icon"
                        currentUrl={form.favicon.favicon16Url}
                        onUrlChange={(url: string) =>
                          setForm((prev) => ({
                            ...prev,
                            favicon: { ...prev.favicon, favicon16Url: url }
                          }))
                        }
                        accept="image/png"
                      />
                    </div>
                  </div>

                  {/* Web Manifest URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Web App Manifest URL
                    </label>
                    <input
                      type="text"
                      value={form.favicon.manifestUrl}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          favicon: { ...prev.favicon, manifestUrl: e.target.value }
                        }))
                      }
                      placeholder="/site.webmanifest"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SITEMAP SETTINGS */}
            {activeTab === 'sitemap' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-santic-red" />
                    <span>XML Sitemap Configuration</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Controls inclusion of this page in automatic website XML sitemap (<code className="font-mono text-santic-red">/sitemap.xml</code>).
                  </p>
                </div>

                {/* Include in Sitemap */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      Include Page in XML Sitemap
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Automatically add this URL to <code className="font-mono text-santic-red">sitemap.xml</code> file.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.sitemap.includeInSitemap}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sitemap: { ...prev.sitemap, includeInSitemap: e.target.checked }
                      }))
                    }
                    className="w-5 h-5 rounded text-santic-red focus:ring-santic-red"
                  />
                </label>

                {form.sitemap.includeInSitemap && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Priority */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                          Sitemap Priority
                        </label>
                        <span className="text-xs font-mono font-bold text-santic-red bg-santic-red/10 px-2 py-0.5 rounded-full">
                          {form.sitemap.priority.toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={form.sitemap.priority}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            sitemap: { ...prev.sitemap, priority: parseFloat(e.target.value) }
                          }))
                        }
                        className="w-full accent-santic-red"
                      />
                      <p className="text-[11px] text-slate-500">
                        Relative priority of this URL compared to other pages (0.1 lowest, 1.0 highest).
                      </p>
                    </div>

                    {/* Change Frequency */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Change Frequency
                      </label>
                      <select
                        value={form.sitemap.changeFreq}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            sitemap: { ...prev.sitemap, changeFreq: e.target.value as any }
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm bg-white"
                      >
                        <option value="always">always</option>
                        <option value="hourly">hourly</option>
                        <option value="daily">daily</option>
                        <option value="weekly">weekly</option>
                        <option value="monthly">monthly</option>
                        <option value="yearly">yearly</option>
                        <option value="never">never</option>
                      </select>
                      <p className="text-[11px] text-slate-500">
                        Indicates how frequently content on this page is likely to change.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: ADVANCED & CUSTOM HEAD TAGS */}
            {activeTab === 'advanced' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Code className="w-4 h-4 text-santic-red" />
                    <span>Technical & Custom Head Tags</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure author, language, browser theme color, and custom raw head elements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Author */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={form.additional.author}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          additional: { ...prev.additional, author: e.target.value }
                        }))
                      }
                      placeholder="e.g., PCZSC Secretariat"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Page Language
                    </label>
                    <input
                      type="text"
                      value={form.additional.language}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          additional: { ...prev.additional, language: e.target.value }
                        }))
                      }
                      placeholder="e.g., en"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>

                  {/* Theme Color */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Browser Theme Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.additional.themeColor}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            additional: { ...prev.additional, themeColor: e.target.value }
                          }))
                        }
                        className="w-10 h-10 rounded-xl border border-slate-300 p-0.5 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={form.additional.themeColor}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            additional: { ...prev.additional, themeColor: e.target.value }
                          }))
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Head Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Custom Head Tags (HTML elements)</span>
                    <span className="text-[10px] text-amber-600 font-bold">Advanced Admin Feature</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.additional.customHeadTags}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        additional: { ...prev.additional, customHeadTags: e.target.value }
                      }))
                    }
                    placeholder={'<meta name="geo.region" content="IN-MH" />\n<meta name="geo.placename" content="Pune" />'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-slate-900 text-santic-yellow focus:outline-none shadow-sm"
                  />
                  <p className="text-[11px] text-slate-500">
                    Allows authorized admin to inject custom valid HTML tags (<code className="font-mono text-slate-700">&lt;meta&gt;</code>, <code className="font-mono text-slate-700">&lt;link&gt;</code>) into page <code className="font-mono text-slate-700">&lt;head&gt;</code>.
                  </p>
                </div>
              </div>
            )}

            {/* Save Buttons Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold flex items-center gap-2 shadow-md uppercase tracking-wider transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Dynamic Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-4 rounded-2xl bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-santic-yellow" />
            <span>Live SEO, Favicon & Social Preview</span>
          </div>

          {/* 0. Browser Tab Simulation Preview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Browser Tab Favicon Preview</span>
              </span>
            </div>

            <div className="rounded-2xl border border-slate-300 bg-slate-200 p-2 space-y-2">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-300 shadow-sm max-w-sm">
                <div className="w-4 h-4 rounded overflow-hidden shrink-0 bg-slate-300 flex items-center justify-center">
                  {(form.favicon?.faviconUrl || form.favicon?.favicon32Url) ? (
                    <img
                      src={form.favicon.faviconUrl || form.favicon.favicon32Url}
                      alt="Favicon"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {form.basic.metaTitle || `${form.pageName} - PCZSC`}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Google Search Engine Preview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Search Snippet</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">Desktop View</span>
            </div>

            <div className="space-y-1 font-sans text-left">
              {/* Domain breadcrumb with favicon */}
              <div className="text-[12px] text-slate-700 flex items-center gap-2 leading-tight">
                <div className="w-4 h-4 rounded overflow-hidden shrink-0 bg-slate-200 flex items-center justify-center">
                  {(form.favicon?.faviconUrl || form.favicon?.favicon32Url) ? (
                    <img
                      src={form.favicon.faviconUrl || form.favicon.favicon32Url}
                      alt="Favicon"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <span className="font-bold text-slate-900">PCZSC</span>
                <span className="text-slate-400">›</span>
                <span className="text-slate-600 truncate">{form.basic.canonicalUrl || `https://pczsc.in${form.pagePath}`}</span>
              </div>

              {/* Search Title */}
              <h4 className="text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug break-words">
                {form.basic.metaTitle || `${form.pageName} | Pune City Zonal Sports Committee`}
              </h4>

              {/* Search Description */}
              <p className="text-xs text-[#4d5156] leading-relaxed break-words line-clamp-2">
                {form.basic.metaDescription || 'No description provided. Search engines will automatically extract text snippets from the page content.'}
              </p>
            </div>
          </div>

          {/* 2. Open Graph Social Media Share Preview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Social Media Card (FB / LinkedIn / WhatsApp)</span>
              </span>
            </div>

            {/* Social Card Box */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm space-y-0">
              {/* Card Banner Image */}
              <div className="h-44 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                {(form.og.ogImage || form.twitter.twitterImage) ? (
                  <img
                    src={form.og.ogImage || form.twitter.twitterImage}
                    alt="Social Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-1">
                    <Share2 className="w-8 h-8 opacity-40" />
                    <span className="text-xs font-medium">Default Page Image</span>
                  </div>
                )}
              </div>

              {/* Card Text Content */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 space-y-1 text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                  PCZSC.IN
                </span>
                <h5 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-1">
                  {form.og.ogTitle || form.basic.metaTitle || `${form.pageName} - PCZSC`}
                </h5>
                <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                  {form.og.ogDescription || form.basic.metaDescription || 'PCZSC Official Portal under Savitribai Phule Pune University.'}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Twitter / X Card Preview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-sky-500" />
                <span>Twitter / X Card Preview</span>
              </span>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                {form.twitter.cardType}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm text-left">
              {(form.twitter.twitterImage || form.og.ogImage) && (
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <img
                    src={form.twitter.twitterImage || form.og.ogImage}
                    alt="Twitter Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
              )}
              <div className="p-3 bg-white space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">
                  pczsc.in
                </span>
                <h6 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                  {form.twitter.twitterTitle || form.og.ogTitle || form.basic.metaTitle || form.pageName}
                </h6>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {form.twitter.twitterDescription || form.og.ogDescription || form.basic.metaDescription}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
