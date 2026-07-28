import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Edit, X, Image as ImageIcon } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useToast } from '../context/ToastContext';
import { MediaRenderer } from './MediaRenderer';
import { FileUploadInput } from './FileUploadInput';

interface SubPageHeroProps {
  pageKey: 'about' | 'documents' | 'gallery' | 'contact';
  category?: string;
  title?: string;
  subtitle?: string;
  bgImageUrl?: string;
}

export const SubPageHero: React.FC<SubPageHeroProps> = ({
  pageKey,
  category = "PCZSC Official Portal",
  title = "Subpage Title",
  subtitle,
  bgImageUrl = "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80"
}) => {
  const { isAdmin, isEditMode, subPagesHeroStore, updateSubPageHero } = useCMS();
  const { showToast } = useToast();

  const heroData = subPagesHeroStore?.[pageKey] || {
    category,
    title,
    subtitle: subtitle || '',
    bgImageUrl
  };

  const showEditControls = isAdmin || isEditMode;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(heroData.category);
  const [editTitle, setEditTitle] = useState(heroData.title);
  const [editSubtitle, setEditSubtitle] = useState(heroData.subtitle);
  const [editBgImage, setEditBgImage] = useState(heroData.bgImageUrl);

  // Sync edit form states whenever heroData updates
  useEffect(() => {
    if (heroData) {
      setEditCategory(heroData.category);
      setEditTitle(heroData.title);
      setEditSubtitle(heroData.subtitle);
      setEditBgImage(heroData.bgImageUrl);
    }
  }, [heroData.category, heroData.title, heroData.subtitle, heroData.bgImageUrl]);

  const handleOpenEdit = () => {
    setEditCategory(heroData.category);
    setEditTitle(heroData.title);
    setEditSubtitle(heroData.subtitle);
    setEditBgImage(heroData.bgImageUrl);
    setShowEditModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubPageHero(pageKey, {
      category: editCategory,
      title: editTitle,
      subtitle: editSubtitle,
      bgImageUrl: editBgImage
    });
    setShowEditModal(false);
    showToast(
      '🎉 Subpage Hero Saved Successfully!',
      'Background photo and hero text updated for this page.',
      'success'
    );
  };

  return (
    <section className="relative min-h-[35vh] md:min-h-[40vh] flex flex-col justify-center pt-28 pb-12 bg-slate-950 text-white overflow-hidden">
      {/* Background Image / Video with Balanced 32% Opacity Overlay */}
      <div className="absolute inset-0 z-0">
        <MediaRenderer
          src={heroData.bgImageUrl}
          alt={heroData.title}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 opacity-32"
          controls={false}
          autoPlay={true}
          loop={true}
          muted={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/45 to-transparent" />
      </div>

      {/* Admin Edit Trigger Overlay Button (Visible when Logged in or in Edit Mode) */}
      {showEditControls && (
        <div className="absolute top-24 right-6 z-30">
          <button
            onClick={handleOpenEdit}
            className="bg-santic-red hover:bg-santic-hoverRed text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-2xl border border-white/20 uppercase tracking-wider transition-all hover:scale-105"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Subpage Hero & Upload Photo</span>
          </button>
        </div>
      )}

      <div className="santic-container relative z-10 my-auto">
        <div className="max-w-4xl space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
            <Link to="/en/home" className="hover:text-santic-red transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-santic-red">{heroData.title}</span>
          </div>

          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-santic-red/20 border border-santic-red/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-santic-red animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-santic-red">
              {heroData.category}
            </span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {heroData.title}
          </h1>

          {heroData.subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed max-w-2xl">
              {heroData.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Admin SubPage Hero Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-santic-red" />
                <span>Edit Subpage Hero & Upload Background Photo/Video</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <FileUploadInput
                sectionName="hero"
                label="Upload Hero Background Photo or Video (Saved to uploads/hero/)"
                currentUrl={editBgImage}
                onUrlChange={(url) => setEditBgImage(url)}
                accept="image/*,video/*"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Eyebrow Badge</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Section Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-red-500/20"
                >
                  Save Hero Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
