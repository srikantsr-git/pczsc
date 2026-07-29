import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { useToast } from '../context/ToastContext';
import { FileUploadInput } from './FileUploadInput';
import { X, Plus, Trash2, Layout, Sliders, FileText, Globe, Layers, Gauge } from 'lucide-react';

interface AdminConfigModalsProps {
  activeTab: 'header' | 'hero' | 'news' | 'metrics' | 'vision' | 'footer' | null;
  onClose: () => void;
}

export const AdminConfigModals: React.FC<AdminConfigModalsProps> = ({ activeTab, onClose }) => {
  const { showToast } = useToast();
  const {
    headerConfig,
    updateHeaderConfig,
    heroSlides,
    updateHeroSlides,
    newsMarquee,
    marqueeSpeed,
    updateMarqueeSpeed,
    updateNewsMarquee,
    metrics,
    updateMetrics,
    visionMission,
    updateVisionMission,
    footerConfig,
    updateFooterConfig
  } = useCMS();

  // Tab State inside modal
  const [currentTab, setCurrentTab] = useState<'header' | 'hero' | 'news' | 'metrics' | 'vision' | 'footer'>(
    activeTab || 'header'
  );

  // Local Form States
  const [localHeader, setLocalHeader] = useState({ ...headerConfig });
  const [localHero, setLocalHero] = useState([...heroSlides]);
  const [localNews, setLocalNews] = useState([...newsMarquee]);
  const [localMetrics, setLocalMetrics] = useState([...metrics]);
  const [localVM, setLocalVM] = useState({ ...visionMission });
  const [localFooter, setLocalFooter] = useState({ ...footerConfig });

  // Sync state whenever context props change
  useEffect(() => {
    setLocalHeader({ ...headerConfig });
    setLocalHero([...heroSlides]);
    setLocalNews([...newsMarquee]);
    setLocalMetrics([...metrics]);
    setLocalVM({ ...visionMission });
    setLocalFooter({ ...footerConfig });
  }, [headerConfig, heroSlides, newsMarquee, metrics, visionMission, footerConfig]);

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeaderConfig(localHeader);
    showToast('Header Config Saved Successfully!', 'Logo and top menu settings have been updated.', 'success');
    onClose();
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroSlides(localHero);
    showToast('Hero Slides Saved Successfully!', 'Homepage banner images and slide text have been updated.', 'success');
    onClose();
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    updateNewsMarquee(localNews);
    showToast('News Marquee Saved Successfully!', 'News items and marquee scroll speed updated.', 'success');
    onClose();
  };

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    updateMetrics(localMetrics);
    showToast('Metrics Updated Successfully!', 'Homepage statistics and counter values updated.', 'success');
    onClose();
  };

  const handleSaveVM = (e: React.FormEvent) => {
    e.preventDefault();
    updateVisionMission(localVM);
    showToast('Vision & Mission Saved!', 'Updated committee vision and core values.', 'success');
    onClose();
  };

  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterConfig(localFooter);
    showToast('Footer Config Saved!', 'Footer copyright text and description updated.', 'success');
    onClose();
  };

  if (!activeTab) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 text-slate-900">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-santic-red flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              CMS
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Admin Website Configuration Portal</h2>
              <p className="text-xs text-white/60">Upload files categorized into section folders (uploads/hero, uploads/logo, etc.)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="flex items-center gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setCurrentTab('header')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              currentTab === 'header' ? 'bg-santic-red text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Header & Logo</span>
          </button>

          <button
            onClick={() => setCurrentTab('hero')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              currentTab === 'hero' ? 'bg-santic-red text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hero Slider</span>
          </button>

          <button
            onClick={() => setCurrentTab('news')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              currentTab === 'news' ? 'bg-santic-red text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>News Marquee</span>
          </button>

          <button
            onClick={() => setCurrentTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              currentTab === 'metrics' ? 'bg-santic-red text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4 Key Metrics</span>
          </button>

          <button
            onClick={() => setCurrentTab('vision')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              currentTab === 'vision' ? 'bg-santic-red text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Vision & Mission</span>
          </button>

          <button
            onClick={() => setCurrentTab('footer')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              currentTab === 'footer' ? 'bg-santic-red text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Footer & Copy</span>
          </button>
        </div>

        {/* Modal Content Window */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: HEADER & LOGO CONFIG */}
          {currentTab === 'header' && (
            <form onSubmit={handleSaveHeader} className="space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                Header & Logo Configuration
              </h3>

              <FileUploadInput
                sectionName="logo"
                label="Upload Logo Image File (Saved to uploads/logo/)"
                currentUrl={localHeader.logoIconUrl || ''}
                onUrlChange={(url) => setLocalHeader({ ...localHeader, logoIconUrl: url })}
                accept="image/*"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Logo Main Text</label>
                  <input
                    type="text"
                    value={localHeader.logoTitle}
                    onChange={(e) => setLocalHeader({ ...localHeader, logoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Logo Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={localHeader.logoSubtitle}
                    onChange={(e) => setLocalHeader({ ...localHeader, logoSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={localHeader.ctaText}
                    onChange={(e) => setLocalHeader({ ...localHeader, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Target Link</label>
                  <input
                    type="text"
                    value={localHeader.ctaPath}
                    onChange={(e) => setLocalHeader({ ...localHeader, ctaPath: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Navigation Items Manager */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Navigation Menu Items</label>
                  <button
                    type="button"
                    onClick={() =>
                      setLocalHeader({
                        ...localHeader,
                        navItems: [...localHeader.navItems, { name: 'New Page', path: '/en/new' }]
                      })
                    }
                    className="text-xs font-bold text-santic-red hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Nav Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {localHeader.navItems.map((nav, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nav.name}
                        onChange={(e) => {
                          const updated = [...localHeader.navItems];
                          updated[idx].name = e.target.value;
                          setLocalHeader({ ...localHeader, navItems: updated });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                        placeholder="Page Name"
                      />
                      <input
                        type="text"
                        value={nav.path}
                        onChange={(e) => {
                          const updated = [...localHeader.navItems];
                          updated[idx].path = e.target.value;
                          setLocalHeader({ ...localHeader, navItems: updated });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                        placeholder="/en/path"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = localHeader.navItems.filter((_, i) => i !== idx);
                          setLocalHeader({ ...localHeader, navItems: updated });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Save Header Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: HERO SLIDER CONFIG */}
          {currentTab === 'hero' && (
            <form onSubmit={handleSaveHero} className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Hero Slides Manager (Upload to uploads/hero/)
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setLocalHero([
                      ...localHero,
                      {
                        id: `hero-${Date.now()}`,
                        eyebrow: "New Eyebrow Tag",
                        title: "New Hero Title Slide",
                        subtitle: "New Hero subtitle description",
                        image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80",
                        ctaText: "Read More",
                        ctaLink: "/en/about-us"
                      }
                    ])
                  }
                  className="bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-santic-red" />
                  <span>Add New Hero Slide</span>
                </button>
              </div>

              <div className="space-y-6">
                {localHero.map((slide, idx) => (
                  <div key={slide.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-santic-red uppercase tracking-wider">
                        Slide {idx + 1}
                      </span>
                      {localHero.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setLocalHero(localHero.filter((s) => s.id !== slide.id))}
                          className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Slide</span>
                        </button>
                      )}
                    </div>

                    <FileUploadInput
                      sectionName="hero"
                      label={`Hero Slide ${idx + 1} Background Image or Video File`}
                      currentUrl={slide.image}
                      onUrlChange={(url) => {
                        const updated = [...localHero];
                        updated[idx].image = url;
                        setLocalHero(updated);
                      }}
                      accept="image/*,video/*"
                    />

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Eyebrow Badge</label>
                      <input
                        type="text"
                        value={slide.eyebrow}
                        onChange={(e) => {
                          const updated = [...localHero];
                          updated[idx].eyebrow = e.target.value;
                          setLocalHero(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Slide Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...localHero];
                          updated[idx].title = e.target.value;
                          setLocalHero(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border text-xs font-extrabold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Slide Subtitle</label>
                      <textarea
                        rows={2}
                        value={slide.subtitle}
                        onChange={(e) => {
                          const updated = [...localHero];
                          updated[idx].subtitle = e.target.value;
                          setLocalHero(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border text-xs font-normal"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary CTA Text</label>
                        <input
                          type="text"
                          value={slide.ctaText}
                          onChange={(e) => {
                            const updated = [...localHero];
                            updated[idx].ctaText = e.target.value;
                            setLocalHero(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary CTA Target Link</label>
                        <input
                          type="text"
                          value={slide.ctaLink}
                          onChange={(e) => {
                            const updated = [...localHero];
                            updated[idx].ctaLink = e.target.value;
                            setLocalHero(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Save & Apply All Hero Slides
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: NEWS MARQUEE CONFIG */}
          {currentTab === 'news' && (
            <form onSubmit={handleSaveNews} className="space-y-6">
              {/* Marquee Speed Slider Setting */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Gauge className="w-4 h-4" />
                    <span>Marquee Scroll Speed</span>
                  </span>
                  <span className="font-mono text-santic-red text-sm font-black">
                    {marqueeSpeed} Seconds {marqueeSpeed <= 10 ? '(Fast)' : marqueeSpeed >= 25 ? '(Slow)' : '(Normal)'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                  <span>Fast (5s)</span>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={marqueeSpeed}
                    onChange={(e) => updateMarqueeSpeed(Number(e.target.value))}
                    className="w-full accent-santic-red h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span>Slow (40s)</span>
                </div>
              </div>

              {/* Informational Banner for Document-based Marquee */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-santic-red" />
                  <span>Home Page Marquee Content Source</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  The home page marquee displays official circulars and sports calendars directly from the <strong>Downloads & Documents</strong> section.
                </p>
                <p className="text-xs text-slate-500 italic bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-slate-700">
                  💡 <strong>How to feature documents on the Home Page Marquee:</strong> Go to the <strong>Downloads</strong> page (or Document Management in Admin Panel) and click the <strong>"Show on Home Page Marquee"</strong> toggle button next to any uploaded circular.
                </p>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Save Scroll Speed Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: METRICS CONFIG */}
          {currentTab === 'metrics' && (
            <form onSubmit={handleSaveMetrics} className="space-y-6">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                4 Key Metrics Cards Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {localMetrics.map((m, idx) => (
                  <div key={m.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-santic-red uppercase tracking-wider">
                      Metric Card {idx + 1}
                    </span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Number / Stat Value</label>
                      <input
                        type="text"
                        value={m.number}
                        onChange={(e) => {
                          const updated = [...localMetrics];
                          updated[idx].number = e.target.value;
                          setLocalMetrics(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border text-lg font-extrabold text-santic-red"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Metric Description Label</label>
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => {
                          const updated = [...localMetrics];
                          updated[idx].label = e.target.value;
                          setLocalMetrics(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border text-xs font-extrabold text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Save Metrics Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: VISION & MISSION CONFIG */}
          {currentTab === 'vision' && (
            <form onSubmit={handleSaveVM} className="space-y-6">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                Vision Statement & Mission Points
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  value={localVM.visionText}
                  onChange={(e) => setLocalVM({ ...localVM, visionText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-xs font-medium"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  10 Mission Bullet Points
                </label>
                {localVM.missions.map((mission, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-6">{idx + 1}.</span>
                    <input
                      type="text"
                      value={mission}
                      onChange={(e) => {
                        const updated = [...localVM.missions];
                        updated[idx] = e.target.value;
                        setLocalVM({ ...localVM, missions: updated });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border text-xs font-medium"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Save Vision & Mission Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: FOOTER CONFIG */}
          {currentTab === 'footer' && (
            <form onSubmit={handleSaveFooter} className="space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                Footer Logo, Text & Copyright Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Footer Logo Title</label>
                  <input
                    type="text"
                    value={localFooter.logoTitle}
                    onChange={(e) => setLocalFooter({ ...localFooter, logoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Footer Subtitle</label>
                  <input
                    type="text"
                    value={localFooter.logoSubtitle}
                    onChange={(e) => setLocalFooter({ ...localFooter, logoSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Footer Description</label>
                <textarea
                  rows={3}
                  value={localFooter.description}
                  onChange={(e) => setLocalFooter({ ...localFooter, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-xs font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Statement</label>
                <input
                  type="text"
                  value={localFooter.copyrightText}
                  onChange={(e) => setLocalFooter({ ...localFooter, copyrightText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Affiliation Statement</label>
                <input
                  type="text"
                  value={localFooter.affiliationText}
                  onChange={(e) => setLocalFooter({ ...localFooter, affiliationText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-medium"
                />
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Save Footer Configuration
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
