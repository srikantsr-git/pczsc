/**
 * Document Utilities for resolving PDF view/download URLs
 */

export const getDocumentPdfUrl = (doc?: { viewUrl?: string; downloadUrl?: string }): string => {
  if (!doc) return '#';

  // If downloadUrl is a valid HTTPS/HTTP/Blob/Data URL, use it
  if (
    doc.downloadUrl &&
    (doc.downloadUrl.startsWith('http://') ||
      doc.downloadUrl.startsWith('https://') ||
      doc.downloadUrl.startsWith('data:') ||
      doc.downloadUrl.startsWith('blob:'))
  ) {
    return doc.downloadUrl;
  }

  // If viewUrl is a valid HTTPS/HTTP/Blob/Data URL, use it
  if (
    doc.viewUrl &&
    (doc.viewUrl.startsWith('http://') ||
      doc.viewUrl.startsWith('https://') ||
      doc.viewUrl.startsWith('data:') ||
      doc.viewUrl.startsWith('blob:'))
  ) {
    return doc.viewUrl;
  }

  return doc.downloadUrl || doc.viewUrl || '#';
};
