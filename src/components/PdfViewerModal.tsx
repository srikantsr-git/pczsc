import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, Loader2, AlertCircle } from 'lucide-react';
import { handleDownloadPdf } from '../utils/documentUtils';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl
}) => {
  const [displayUrl, setDisplayUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !pdfUrl) {
      setDisplayUrl('');
      setLoading(false);
      setError(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(false);

    const prepareUrl = async () => {
      try {
        if (pdfUrl.startsWith('data:')) {
          // Convert data: base64 PDF to Blob URL for iframe rendering
          const res = await fetch(pdfUrl);
          const blob = await res.blob();
          if (active) {
            const blobUrl = URL.createObjectURL(blob);
            setDisplayUrl(blobUrl);
            setLoading(false);
          }
        } else {
          if (active) {
            setDisplayUrl(pdfUrl);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('PdfViewerModal error preparing PDF URL:', err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    };

    prepareUrl();

    return () => {
      active = false;
      if (displayUrl && displayUrl.startsWith('blob:')) {
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [isOpen, pdfUrl]);

  if (!isOpen) return null;

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    try {
      await handleDownloadPdf(pdfUrl, title);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenExternal = () => {
    if (displayUrl) {
      window.open(displayUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 rounded-xl bg-santic-red/10 border border-santic-red/20 text-santic-red shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate" title={title}>
                {title || 'Document Viewer'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Official PCZSC Document & Circular Repository
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Open in new tab button */}
            <button
              onClick={handleOpenExternal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700"
              title="Open PDF in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>

            {/* Download button */}
            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold transition-all shadow-md shadow-red-500/20 disabled:opacity-50"
              title="Download PDF file"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 ml-1"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Frame */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-santic-red animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider">Loading Document Preview...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500" />
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white">Preview Unable to Load Direct</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This PDF file cannot be embedded directly inside the browser frame due to external server restrictions.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadClick}
                  className="px-5 py-2.5 rounded-xl bg-santic-red text-white text-xs font-extrabold flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
                <button
                  onClick={handleOpenExternal}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-2 border border-slate-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Direct Link</span>
                </button>
              </div>
            </div>
          )}

          {!loading && !error && displayUrl && (
            <iframe
              src={displayUrl}
              title={title}
              className="w-full h-full border-0 bg-white"
            />
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 font-medium shrink-0">
          <span className="truncate">
            Document Title: <strong className="text-slate-200">{title}</strong>
          </span>
          <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
            <span>PCZSC Official Archive</span>
          </div>
        </div>

      </div>
    </div>
  );
};
