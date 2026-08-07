/**
 * Document Utilities for resolving and handling PDF view/download URLs
 */

export const getDocumentPdfUrl = (doc?: { viewUrl?: string; downloadUrl?: string }): string => {
  if (!doc) return '#';

  const validUrl = (url?: string) => {
    if (!url) return false;
    const clean = url.trim();
    return (
      clean.startsWith('http://') ||
      clean.startsWith('https://') ||
      clean.startsWith('data:') ||
      clean.startsWith('blob:') ||
      clean.startsWith('/api/media') ||
      clean.startsWith('/')
    );
  };

  if (validUrl(doc.viewUrl)) return doc.viewUrl!.trim();
  if (validUrl(doc.downloadUrl)) return doc.downloadUrl!.trim();

  return doc.viewUrl || doc.downloadUrl || '#';
};

/**
 * Programmatically open a PDF document in a new tab, converting base64 data URLs
 * to Blob URLs so modern browsers (Chrome/Edge/Firefox) won't block top-frame data URL navigation.
 */
export const handleViewPdf = async (url?: string, title: string = 'Document') => {
  if (!url || url === '#' || url.trim() === '') {
    alert('Document URL is not available.');
    return;
  }

  const cleanUrl = url.trim();

  // If base64 Data URL, convert to Blob URL to prevent Chrome top-frame navigation block
  if (cleanUrl.startsWith('data:')) {
    try {
      const res = await fetch(cleanUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const newWin = window.open(blobUrl, '_blank', 'noopener,noreferrer');
      if (!newWin) {
        window.location.href = blobUrl;
      }
    } catch (err) {
      console.error('Error opening data URL PDF:', err);
      alert('Unable to open document data URL.');
    }
    return;
  }

  // Standard HTTPS/HTTP/Blob/Relative URL: open in new tab
  window.open(cleanUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Programmatically trigger a direct browser file download for a PDF.
 * Works for Data URLs, local Blob URLs, and Cross-Origin CDN URLs (Vercel Blob / AWS S3).
 */
export const handleDownloadPdf = async (url?: string, title: string = 'Document') => {
  if (!url || url === '#' || url.trim() === '') {
    alert('Document URL is not available for download.');
    return;
  }

  const cleanUrl = url.trim();
  const safeFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

  try {
    // 1. Fetch file data as blob to force browser download prompt (bypass CORS download attribute restriction)
    const response = await fetch(cleanUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = safeFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up blob URL after delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.warn('Fetch blob download fallback triggered:', err);

    // Fallback: direct anchor trigger
    const a = document.createElement('a');
    a.href = cleanUrl;
    a.download = safeFilename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
