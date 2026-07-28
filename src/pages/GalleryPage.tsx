import React, { useState } from 'react';
import { SubPageHero } from '../components/SubPageHero';
import { useCMS, GalleryItem } from '../context/CMSContext';
import { FileUploadInput } from '../components/FileUploadInput';
import { MediaRenderer } from '../components/MediaRenderer';
import { Plus, Trash2, X, Maximize2, Play, FolderPlus, Tag } from 'lucide-react';
import { isVideoUrl } from '../utils/fileUpload';

export const GalleryPage: React.FC = () => {
  const {
    galleryItems,
    galleryCategories,
    addGalleryCategory,
    deleteGalleryCategory,
    isEditMode,
    addGalleryItem,
    deleteGalleryItem
  } = useCMS();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  // Add Photo/Video Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<string>(galleryCategories[0] || 'Intercollegiate Competitions');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');

  // Add Category Modal
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const categories = ['All', ...galleryCategories];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem({
      title: photoTitle,
      category: photoCategory,
      imageUrl: photoUrl,
      description: photoDesc,
      date: new Date().getFullYear().toString()
    });
    setPhotoTitle('');
    setPhotoUrl('');
    setPhotoDesc('');
    setShowAddModal(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addGalleryCategory(newCategoryName.trim());
      setPhotoCategory(newCategoryName.trim()); // Auto select new category
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <SubPageHero pageKey="gallery" />

      <section className="santic-section bg-slate-50/70 border-b border-slate-200/80">
        <div className="santic-container space-y-10">
          
          {/* Category Filter & Admin Action Bar (Only visible when Admin Edit Mode is Active) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-santic-red text-white border-santic-red shadow-md shadow-red-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Admin-Only Control Buttons */}
            {isEditMode && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm"
                >
                  <FolderPlus className="w-4 h-4 text-santic-red" />
                  <span>Add New Category</span>
                </button>

                <button
                  onClick={() => {
                    if (galleryCategories.length > 0) {
                      setPhotoCategory(galleryCategories[0]);
                    }
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-santic-red text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Media to Gallery</span>
                </button>
              </div>
            )}
          </div>

          {/* Photo & Video Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const isVid = isVideoUrl(item.imageUrl);
              return (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-2xl hover:border-santic-red/40 transition-all duration-300 relative"
                >
                  <div>
                    <div className="relative h-64 overflow-hidden bg-slate-950">
                      <MediaRenderer
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        controls={false}
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />

                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          {item.category}
                        </span>
                        {isVid && (
                          <span className="text-[10px] font-extrabold uppercase text-santic-red bg-santic-red/20 border border-santic-red px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Play className="w-3 h-3 fill-current" />
                            <span>VIDEO</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveLightbox(item)}
                        className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 text-slate-900 hover:bg-santic-red hover:text-white shadow-lg transition-colors"
                        title="View Full Size"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-santic-red transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Admin-Only Delete Action */}
                  {isEditMode && (
                    <div className="px-6 pb-6 pt-0 flex justify-end border-t border-slate-100">
                      <button
                        onClick={() => deleteGalleryItem(item.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Media</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Lightbox Zoom Modal (Scrollable) */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl shadow-2xl border border-white/10 text-white relative my-auto">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-santic-red transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-[55vh] bg-black flex items-center justify-center">
              <MediaRenderer
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="w-full h-full object-contain"
                controls={true}
                autoPlay={true}
              />
            </div>

            <div className="p-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-santic-red">
                {activeLightbox.category}
              </span>
              <h3 className="text-xl font-extrabold text-white">{activeLightbox.title}</h3>
              <p className="text-xs text-white/80 leading-relaxed">{activeLightbox.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Category Modal (Scrollable) */}
      {isEditMode && showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-5 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-santic-red">
                <Tag className="w-5 h-5" />
                <h3 className="text-lg font-extrabold text-slate-900">Add New Gallery Category</h3>
              </div>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. State Level Tournaments"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                  autoFocus
                />
              </div>

              {/* List of existing categories with delete option */}
              <div className="space-y-2 pt-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Existing Categories ({galleryCategories.length})
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {galleryCategories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border text-xs font-semibold">
                      <span>{cat}</span>
                      {galleryCategories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteGalleryCategory(cat)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Photo / Video Modal (Admin Only) */}
      {isEditMode && showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto scrollbar-thin">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Upload Media to Gallery (uploads/gallery/)</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Media Title</label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              {/* Dynamic Category Select Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Category Dropdown</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowAddCategoryModal(true);
                    }}
                    className="text-xs font-bold text-santic-red hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Category</span>
                  </button>
                </div>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
                  required
                >
                  {galleryCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <FileUploadInput
                sectionName="gallery"
                label="Upload Image or Video File (Saved to uploads/gallery/)"
                currentUrl={photoUrl}
                onUrlChange={(url) => setPhotoUrl(url)}
                accept="image/*,video/*"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Publish Gallery Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
