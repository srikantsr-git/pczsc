import React, { useState } from 'react';
import { readUploadedFile } from '../utils/fileUpload';
import { MediaRenderer } from './MediaRenderer';
import { Upload, Folder, CheckCircle2, Loader2 } from 'lucide-react';

interface FileUploadInputProps {
  sectionName: string; // e.g. "hero", "gallery", "sections", "documents", "logo"
  currentUrl: string;
  onUrlChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  sectionName,
  currentUrl,
  onUrlChange,
  label = "Upload Image or Video File",
  accept = "image/*,video/*,.pdf"
}) => {
  const [virtualFolder, setVirtualFolder] = useState<string>(
    `uploads/${sectionName.toLowerCase()}/`
  );
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await readUploadedFile(file, sectionName);
      setFileName(file.name);
      setVirtualFolder(result.virtualPath);
      if (result.dataUrl) {
        onUrlChange(result.dataUrl);
      }
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input value for re-uploading
    }
  };

  return (
    <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-santic-red uppercase tracking-wider bg-santic-red/10 px-2 py-0.5 rounded border border-santic-red/20">
          <Folder className="w-3 h-3" />
          <span>Folder: uploads/{sectionName.toLowerCase()}/</span>
        </div>
      </div>

      {/* Drag & Drop File Upload Box */}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-santic-red rounded-xl p-4 transition-colors text-center bg-white cursor-pointer group">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />

        <div className="flex flex-col items-center justify-center space-y-1.5 text-slate-500 group-hover:text-santic-red transition-colors">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-santic-red animate-spin" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
          <p className="text-xs font-bold text-slate-800">
            {isUploading ? 'Processing File & Generating Preview...' : 'Click to Browse or Drag File Here'}
          </p>
          <p className="text-[10px] text-slate-400">
            Supports Images (JPG, PNG, WebP), Videos (MP4, WebM) & PDFs
          </p>
        </div>
      </div>

      {/* File Path Confirmation */}
      {fileName && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate font-bold text-slate-800">{fileName}</span>
          </div>
          <span className="text-[10px] font-mono text-santic-red font-bold shrink-0 ml-2">
            Saved to: {virtualFolder}
          </span>
        </div>
      )}

      {/* Preview Box */}
      {currentUrl && (
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Real-time Media Preview:
          </span>
          <div className="relative max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 flex items-center justify-center">
            <MediaRenderer
              src={currentUrl}
              className="max-h-48 w-full object-contain"
              controls={true}
            />
          </div>
        </div>
      )}

      {/* Fallback External URL Input */}
      <div className="pt-1">
        <span className="text-[10px] text-slate-400 font-semibold block mb-1">
          Or paste external Image/Video URL:
        </span>
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
          placeholder="https://example.com/media.mp4"
        />
      </div>
    </div>
  );
};
