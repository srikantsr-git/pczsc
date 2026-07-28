import React, { useState } from 'react';
import { useCMS, SectionContent } from '../context/CMSContext';
import { FileUploadInput } from './FileUploadInput';
import { MediaRenderer } from './MediaRenderer';
import { AlignLeft, AlignRight, Eye, EyeOff, Trash2, Edit } from 'lucide-react';

interface ImageWithTextBlockProps {
  section: SectionContent;
  page: 'home' | 'about';
}

export const ImageWithTextBlock: React.FC<ImageWithTextBlockProps> = ({ section, page }) => {
  const { isEditMode, updateSection, toggleHideSection, deleteSection } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle || '');
  const [body, setBody] = useState(section.body);
  const [imageUrl, setImageUrl] = useState(section.imageUrl || '');
  const [imagePosition, setImagePosition] = useState<'left' | 'right'>(
    section.imagePosition || 'right'
  );

  if (section.isHidden && !isEditMode) {
    return null;
  }

  const handleSave = () => {
    updateSection(page, {
      ...section,
      title,
      subtitle,
      body,
      imageUrl,
      imagePosition
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`relative rounded-3xl transition-all ${
        section.isHidden ? 'opacity-50 grayscale bg-slate-100 p-6 border-2 border-dashed border-slate-300' : ''
      } ${isEditMode ? 'p-6 bg-slate-50/80 border-2 border-dashed border-santic-red/40 hover:border-santic-red' : ''}`}
    >
      {/* Admin Inline Toolbar */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900 text-white p-2 rounded-xl shadow-xl text-xs font-bold">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 bg-santic-red px-2.5 py-1 rounded hover:bg-santic-hoverRed transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Section'}</span>
          </button>

          <button
            onClick={() => toggleHideSection(page, section.id)}
            className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded hover:bg-white/20"
            title={section.isHidden ? 'Show Section' : 'Hide Section'}
          >
            {section.isHidden ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={() => deleteSection(page, section.id)}
            className="p-1 rounded bg-red-600/80 hover:bg-red-700 text-white"
            title="Delete Section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Edit Form Mode */}
      {isEditing ? (
        <div className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-slate-900 mt-8">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-santic-red">
            Edit Section Content & Upload Media (uploads/sections/)
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Category Badge</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
            />
          </div>

          <FileUploadInput
            sectionName="sections"
            label="Upload Section Image or Video (Saved to uploads/sections/)"
            currentUrl={imageUrl}
            onUrlChange={(url) => setImageUrl(url)}
            accept="image/*,video/*"
          />

          {imageUrl && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Media Float Position
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setImagePosition('left')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    imagePosition === 'left'
                      ? 'bg-santic-red text-white border-santic-red'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                  <span>Float Left of Paragraph</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImagePosition('right')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    imagePosition === 'right'
                      ? 'bg-santic-red text-white border-santic-red'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                  <span>Float Right of Paragraph</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Paragraph Content</label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-normal text-slate-900"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-santic-red hover:bg-santic-hoverRed text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-red-500/20"
          >
            Save Changes
          </button>
        </div>
      ) : (
        /* Render Mode */
        <div className="clearfix space-y-4">
          {subtitle && (
            <span className="text-xs uppercase tracking-widest text-santic-red font-extrabold block">
              {subtitle}
            </span>
          )}

          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {title}
            </h2>
          )}

          {/* Floated Image/Video with proper margin */}
          {imageUrl && (
            <div
              className={`mb-6 ${
                imagePosition === 'left'
                  ? 'float-none md:float-left md:mr-8 md:mb-6 max-w-md'
                  : 'float-none md:float-right md:ml-8 md:mb-6 max-w-md'
              }`}
            >
              <MediaRenderer
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-cover rounded-3xl border border-slate-200 shadow-xl"
                controls={true}
              />
            </div>
          )}

          <div className="text-slate-600 text-base md:text-lg leading-relaxed font-normal space-y-4">
            {body.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
