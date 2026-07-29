import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Bell,
  Gauge,
  Edit,
  Plus,
  Trash2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useCMS, PillarItem } from '../context/CMSContext';
import { ImageWithTextBlock } from '../components/ImageWithTextBlock';
import { AdminConfigModals } from '../components/AdminConfigModals';
import { MediaRenderer } from '../components/MediaRenderer';
import { FileUploadInput } from '../components/FileUploadInput';
import { SEOHead } from '../components/SEOHead';
import { getDocumentPdfUrl } from '../utils/documentUtils';

export const HomePage: React.FC = () => {
  const {
    documents,
    heroSlides,
    updateHeroSlides,
    addHeroSlide,
    deleteHeroSlide,
    homeAboutConfig,
    updateHomeAboutConfig,
    pillarsConfig,
    updatePillarsConfig,
    newsMarquee,
    marqueeSpeed,
    updateMarqueeSpeed,
    metrics,
    homeSections,
    isEditMode
  } = useCMS();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeConfigTab, setActiveConfigTab] = useState<
    'header' | 'hero' | 'news' | 'metrics' | 'vision' | 'footer' | null
  >(null);

  // Direct Inline Hero Edit Modal State
  const [showInlineHeroModal, setShowInlineHeroModal] = useState(false);
  const [editEyebrow, setEditEyebrow] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCtaText, setEditCtaText] = useState('');
  const [editCtaLink, setEditCtaLink] = useState('');

  // Inline Home About Edit Modal State
  const [showHomeAboutModal, setShowHomeAboutModal] = useState(false);
  const [aboutBadge, setAboutBadge] = useState(homeAboutConfig.badge);
  const [aboutTitle, setAboutTitle] = useState(homeAboutConfig.title);
  const [aboutDescription, setAboutDescription] = useState(homeAboutConfig.description);
  const [aboutImage, setAboutImage] = useState(homeAboutConfig.imageUrl);
  const [aboutCtaText, setAboutCtaText] = useState(homeAboutConfig.ctaText);
  const [aboutCtaLink, setAboutCtaLink] = useState(homeAboutConfig.ctaLink);

  // Inline Key Pillars Edit Modal State
  const [showPillarsModal, setShowPillarsModal] = useState(false);
  const [pillarsBadge, setPillarsBadge] = useState(pillarsConfig.badge);
  const [pillarsTitle, setPillarsTitle] = useState(pillarsConfig.title);
  const [pillarsImage, setPillarsImage] = useState(pillarsConfig.showcaseImage);
  const [editPillarsList, setEditPillarsList] = useState<PillarItem[]>(pillarsConfig.pillars);

  // Auto-play hero slider
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeHero = heroSlides[currentSlide] || heroSlides[0];

  const handleOpenInlineHeroEdit = () => {
    if (!activeHero) return;
    setEditEyebrow(activeHero.eyebrow);
    setEditTitle(activeHero.title);
    setEditSubtitle(activeHero.subtitle);
    setEditImage(activeHero.image);
    setEditCtaText(activeHero.ctaText);
    setEditCtaLink(activeHero.ctaLink);
    setShowInlineHeroModal(true);
  };

  const handleSaveInlineHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHero) return;

    const updated = heroSlides.map((s, idx) =>
      idx === currentSlide
        ? {
            ...s,
            eyebrow: editEyebrow,
            title: editTitle,
            subtitle: editSubtitle,
            image: editImage,
            ctaText: editCtaText,
            ctaLink: editCtaLink
          }
        : s
    );

    updateHeroSlides(updated);
    setShowInlineHeroModal(false);
  };

  const handleQuickAddNewSlide = () => {
    addHeroSlide({
      eyebrow: "New Championship Highlight",
      title: "Enter New Hero Title Here",
      subtitle: "Enter description text for the new hero slide.",
      image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80",
      ctaText: "Explore More",
      ctaLink: "/en/documents"
    });
    setCurrentSlide(heroSlides.length); // Jump to new slide
  };

  const handleSaveHomeAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeAboutConfig({
      badge: aboutBadge,
      title: aboutTitle,
      description: aboutDescription,
      imageUrl: aboutImage,
      ctaText: aboutCtaText,
      ctaLink: aboutCtaLink
    });
    setShowHomeAboutModal(false);
  };

  const handleSavePillars = (e: React.FormEvent) => {
    e.preventDefault();
    updatePillarsConfig({
      badge: pillarsBadge,
      title: pillarsTitle,
      showcaseImage: pillarsImage,
      pillars: editPillarsList
    });
    setShowPillarsModal(false);
  };

  const updatePillarItem = (index: number, field: 'title' | 'description', val: string) => {
    const updated = editPillarsList.map((p, idx) =>
      idx === index ? { ...p, [field]: val } : p
    );
    setEditPillarsList(updated);
  };

  // Pillar tab state
  const [activePillar, setActivePillar] = useState(0);

  const fallbackIcons = [
    <Sparkles className="w-6 h-6 text-santic-red" />,
    <Cpu className="w-6 h-6 text-santic-red" />,
    <Layers className="w-6 h-6 text-santic-red" />,
    <ShieldCheck className="w-6 h-6 text-santic-red" />
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <SEOHead pageKey="home" />
      {/* ========================================================================= */}
      {/* 1. HERO SLIDER & VERTICAL NEWS MARQUEE PANEL (FULL SCREEN HEIGHT FITTED) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen lg:h-[100vh] min-h-[680px] flex flex-col justify-between pt-28 pb-10 lg:pb-12 overflow-hidden bg-slate-950 text-white">
        {/* Slider Background Images / Videos with dynamic key to reflect updates instantly */}
        {heroSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${slide.image}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <MediaRenderer
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
              controls={false}
              autoPlay={true}
              loop={true}
              muted={true}
            />
            {/* Dark contrast overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
          </div>
        ))}

        {/* DIRECT INLINE ADMIN HERO CONTROLS TOOLBAR */}
        {isEditMode && (
          <div className="absolute top-24 right-6 z-30 flex items-center gap-2">
            <button
              onClick={handleOpenInlineHeroEdit}
              className="bg-santic-red hover:bg-santic-hoverRed text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-2xl border border-white/20 uppercase tracking-wider"
              title="Edit Title, Text & Photo for Active Slide"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Active Slide</span>
            </button>

            <button
              onClick={handleOpenInlineHeroEdit}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-2xl border border-white/20 uppercase tracking-wider"
              title="Upload Image/Video for Hero Background"
            >
              <ImageIcon className="w-4 h-4 text-santic-red" />
              <span>Upload Photo/Video</span>
            </button>

            <button
              onClick={handleQuickAddNewSlide}
              className="bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 backdrop-blur-md border border-white/20"
              title="Add New Hero Slide"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slide</span>
            </button>

            {heroSlides.length > 1 && (
              <button
                onClick={() => deleteHeroSlide(activeHero.id)}
                className="bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-xl border border-white/20 shadow-lg"
                title="Delete Active Slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Main Hero Content & News Marquee Grid */}
        <div className="santic-container relative z-20 my-auto pt-4 lg:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Slider Content */}
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              {activeHero && (
                <>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md animate-fade-in">
                    <span className="w-2.5 h-2.5 rounded-full bg-santic-red animate-pulse" />
                    <span className="text-xs uppercase tracking-widest font-semibold text-white/90">
                      {activeHero.eyebrow}
                    </span>
                  </div>

                  <div key={`${currentSlide}-${activeHero.title}`} className="animate-fade-in space-y-5">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-3xl">
                      {activeHero.title}
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/85 font-light leading-relaxed max-w-2xl">
                      {activeHero.subtitle}
                    </p>

                    <div className="pt-3 flex flex-wrap items-center gap-4">
                      <Link
                        to={activeHero.ctaLink}
                        className="inline-flex items-center gap-2.5 bg-santic-red hover:bg-santic-hoverRed text-white px-7 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-red-600/35 hover:scale-105"
                      >
                        <span>{activeHero.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to="/en/contact-us"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border border-white/20 backdrop-blur-md"
                      >
                        <span>Get In Touch</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: News Panel with Vertical Marquee */}
            <div className="lg:col-span-4 relative">
              {isEditMode && (
                <button
                  onClick={() => setActiveConfigTab('news')}
                  className="absolute -top-3 -right-3 z-30 bg-santic-red text-white p-2 rounded-full shadow-lg"
                  title="Edit News Marquee"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="bg-slate-900/85 border border-white/15 backdrop-blur-xl rounded-3xl p-6 shadow-2xl space-y-4">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-santic-red">
                    <Bell className="w-4 h-4 animate-bounce" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                      Latest Circulars Marquee
                    </span>
                  </div>
                  <Link
                    to="/en/documents"
                    className="text-[11px] font-bold text-santic-red hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Vertical Scrolling Marquee Window */}
                <div className="relative h-64 overflow-hidden rounded-2xl bg-black/40 border border-white/10">
                  {(() => {
                    const activeDocNews = documents
                      .filter((doc) => doc.showOnNewsMarquee)
                      .map((doc) => ({
                        id: `news-doc-${doc.id}`,
                        tag: doc.category,
                        date: doc.date,
                        title: doc.title,
                        link: getDocumentPdfUrl(doc)
                      }));

                    const itemsToDisplay =
                      activeDocNews.length > 0
                        ? activeDocNews
                        : newsMarquee.filter((item) => item.id.startsWith('news-doc-'));

                    if (itemsToDisplay.length === 0) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white/50 space-y-2">
                          <Bell className="w-6 h-6 text-santic-red/60" />
                          <p className="text-xs font-semibold">No circulars currently featured on news marquee.</p>
                          <Link to="/en/documents" className="text-xs text-santic-red hover:underline font-bold">
                            View All Downloads
                          </Link>
                        </div>
                      );
                    }

                    const loopList = [...itemsToDisplay, ...itemsToDisplay];

                    return (
                      <div
                        className="animate-vertical-marquee p-3 space-y-3"
                        style={{ animationDuration: `${Math.max(10, marqueeSpeed)}s` }}
                      >
                        {loopList.map((item, index) => (
                          <a
                            key={`${item.id}-${index}`}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3.5 rounded-xl bg-white/5 hover:bg-santic-red/20 border border-white/10 hover:border-santic-red/50 transition-all duration-200 group"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[10px] font-extrabold text-santic-red uppercase tracking-wider bg-santic-red/10 px-2 py-0.5 rounded border border-santic-red/20">
                                {item.tag}
                              </span>
                              <span className="text-[10px] font-mono text-white/60 font-bold">{item.date}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 leading-normal break-words">
                              {item.title}
                            </h4>
                          </a>
                        ))}
                      </div>
                    );
                  })()}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                <p className="text-[11px] text-white/40 text-center italic pt-1">
                  Hover marquee to pause news stream
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Hero Slider Dots & Controls */}
        <div className="santic-container relative z-20 w-full pt-6">
          <div className="flex items-center justify-between gap-4">
            {/* Dots */}
            <div className="flex items-center gap-3">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? 'w-10 bg-santic-red shadow-md shadow-red-500/50'
                      : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white/10 hover:bg-santic-red text-white border border-white/20 transition-all backdrop-blur-md"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white/10 hover:bg-santic-red text-white border border-white/20 transition-all backdrop-blur-md"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT PCZSC SECTION (100% EDITABLE BY ADMIN) */}
      {/* ========================================================================= */}
      <section id="about-santic" className="santic-section bg-white border-b border-slate-100 relative">
        <div className="santic-container space-y-16">
          {/* Eyebrow Header & Admin Edit Trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-santic-red" />
              <span className="text-xs uppercase tracking-widest text-santic-red font-bold">
                {homeAboutConfig.badge}
              </span>
            </div>

            {isEditMode && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setAboutBadge(homeAboutConfig.badge);
                    setAboutTitle(homeAboutConfig.title);
                    setAboutDescription(homeAboutConfig.description);
                    setAboutImage(homeAboutConfig.imageUrl);
                    setAboutCtaText(homeAboutConfig.ctaText);
                    setAboutCtaLink(homeAboutConfig.ctaLink);
                    setShowHomeAboutModal(true);
                  }}
                  className="bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md uppercase tracking-wider"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit About Section & Photo</span>
                </button>

                <button
                  onClick={() => setActiveConfigTab('metrics')}
                  className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit 4 Metrics</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                {homeAboutConfig.title}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
                {homeAboutConfig.description}
              </p>
              <div className="pt-4">
                <Link
                  to={homeAboutConfig.ctaLink}
                  className="inline-flex items-center gap-3 bg-santic-red hover:bg-santic-hoverRed text-white px-8 py-4 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-red-500/20 group"
                >
                  <span>{homeAboutConfig.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* Overview Image / Video Renderer */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <MediaRenderer
                  src={homeAboutConfig.imageUrl}
                  alt={homeAboutConfig.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  controls={true}
                  autoPlay={true}
                  loop={true}
                  muted={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 4 KEY METRICS BOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {metrics.map((m) => (
              <div
                key={m.id}
                className="p-8 lg:p-10 rounded-3xl bg-slate-50/90 border border-slate-200/90 hover:border-santic-red hover:bg-white hover:shadow-2xl transition-all duration-300 space-y-3 group"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-santic-red font-numeric tracking-tight group-hover:scale-105 transition-transform">
                  {m.number}
                </div>
                <p className="text-sm sm:text-base md:text-lg text-slate-900 uppercase tracking-wide font-extrabold leading-snug">
                  {m.label}
                </p>
                <div className="w-12 h-1 bg-santic-red/30 group-hover:w-full group-hover:bg-santic-red transition-all duration-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Custom Home Sections */}
      {homeSections.map((sec) => (
        <ImageWithTextBlock key={sec.id} section={sec} page="home" />
      ))}

      {/* ========================================================================= */}
      {/* 3. HOW WE DO IT / KEY PILLARS SECTION (100% EDITABLE BY ADMIN) */}
      {/* ========================================================================= */}
      <section id="how-we-do-it" className="santic-section bg-slate-50/70 border-b border-slate-200/80 relative">
        <div className="santic-container space-y-14">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-santic-red" />
                <span className="text-xs uppercase tracking-widest text-santic-red font-bold">
                  {pillarsConfig.badge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 max-w-4xl leading-tight">
                {pillarsConfig.title}
              </h2>
            </div>

            {isEditMode && (
              <button
                onClick={() => {
                  setPillarsBadge(pillarsConfig.badge);
                  setPillarsTitle(pillarsConfig.title);
                  setPillarsImage(pillarsConfig.showcaseImage);
                  setEditPillarsList(pillarsConfig.pillars);
                  setShowPillarsModal(true);
                }}
                className="bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md uppercase tracking-wider shrink-0"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Key Pillars & Photo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: 4 Pillar Selector Tabs */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {pillarsConfig.pillars.map((pillar, idx) => {
                const isActive = activePillar === idx;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActivePillar(idx)}
                    className={`text-left p-7 md:p-8 rounded-3xl transition-all duration-300 border ${
                      isActive
                        ? 'bg-red-50/80 border-santic-red shadow-lg shadow-red-500/15'
                        : 'bg-white border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-santic-red/10 flex items-center justify-center shrink-0">
                        {fallbackIcons[idx % fallbackIcons.length]}
                      </div>
                      <h3 className={`text-lg sm:text-xl md:text-2xl font-extrabold leading-snug ${isActive ? 'text-santic-red' : 'text-slate-900'}`}>
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed pl-13 font-normal">
                      {pillar.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Showcase Image/Video */}
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl min-h-[420px]">
              <MediaRenderer
                src={pillarsConfig.showcaseImage}
                alt={pillarsConfig.title}
                className="w-full h-full object-cover"
                controls={true}
                autoPlay={true}
                loop={true}
                muted={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-8 md:p-12 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-xs text-santic-red font-bold uppercase tracking-wider mb-2">
                  Pillar {activePillar + 1} of {pillarsConfig.pillars.length}
                </span>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3">
                  {pillarsConfig.pillars[activePillar]?.title}
                </h4>
                <p className="text-xs md:text-sm text-white/90 max-w-xl leading-relaxed font-normal">
                  {pillarsConfig.pillars[activePillar]?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECT INLINE HERO SLIDE EDIT MODAL */}
      {showInlineHeroModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Edit Slide {currentSlide + 1} & Upload Background Photo/Video
              </h3>
              <button
                type="button"
                onClick={() => setShowInlineHeroModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInlineHero} className="space-y-4">
              <FileUploadInput
                sectionName="hero"
                label={`Upload Photo or Video for Slide ${currentSlide + 1} (Saved to uploads/hero/)`}
                currentUrl={editImage}
                onUrlChange={(url) => setEditImage(url)}
                accept="image/*,video/*"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eyebrow Tag / University Name</label>
                <input
                  type="text"
                  value={editEyebrow}
                  onChange={(e) => setEditEyebrow(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Slide Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Slide Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-normal"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={editCtaText}
                    onChange={(e) => setEditCtaText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={editCtaLink}
                    onChange={(e) => setEditCtaLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowInlineHeroModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-red-500/20"
                >
                  Save & Apply Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOME ABOUT SECTION EDIT MODAL */}
      {showHomeAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Edit Home Page "About PCZSC" Section & Upload Photo/Video
              </h3>
              <button
                type="button"
                onClick={() => setShowHomeAboutModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHomeAbout} className="space-y-4">
              <FileUploadInput
                sectionName="sections"
                label="Upload Section Photo or Video (Saved to uploads/sections/)"
                currentUrl={aboutImage}
                onUrlChange={(url) => setAboutImage(url)}
                accept="image/*,video/*"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tagline</label>
                <input
                  type="text"
                  value={aboutBadge}
                  onChange={(e) => setAboutBadge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Title</label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Description</label>
                <textarea
                  rows={4}
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-normal"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={aboutCtaText}
                    onChange={(e) => setAboutCtaText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Target Link</label>
                  <input
                    type="text"
                    value={aboutCtaLink}
                    onChange={(e) => setAboutCtaLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowHomeAboutModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-red-500/20"
                >
                  Save Section Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KEY PILLARS EDIT MODAL */}
      {showPillarsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Edit Key Pillars & Showcase Photo/Video
              </h3>
              <button
                type="button"
                onClick={() => setShowPillarsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePillars} className="space-y-4">
              <FileUploadInput
                sectionName="sections"
                label="Upload Key Pillars Showcase Photo or Video (Saved to uploads/sections/)"
                currentUrl={pillarsImage}
                onUrlChange={(url) => setPillarsImage(url)}
                accept="image/*,video/*"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tagline</label>
                  <input
                    type="text"
                    value={pillarsBadge}
                    onChange={(e) => setPillarsBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Title</label>
                  <input
                    type="text"
                    value={pillarsTitle}
                    onChange={(e) => setPillarsTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold"
                    required
                  />
                </div>
              </div>

              {/* 4 Pillars Fields */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-santic-red">
                  Individual Pillars (4 Cards)
                </h4>
                {editPillarsList.map((p, idx) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pillar #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => updatePillarItem(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      placeholder="Pillar Title"
                      required
                    />
                    <textarea
                      rows={2}
                      value={p.description}
                      onChange={(e) => updatePillarItem(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-normal"
                      placeholder="Pillar Description"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPillarsModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-red-500/20"
                >
                  Save Pillars Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeConfigTab && (
        <AdminConfigModals
          activeTab={activeConfigTab}
          onClose={() => setActiveConfigTab(null)}
        />
      )}
    </main>
  );
};
