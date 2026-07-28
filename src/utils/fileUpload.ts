/**
 * File Upload & Media Storage Helper Utilities for PCZSC CMS
 * Uploads media files (PNG, JPEG, PDF, MP4) directly to Cloud Storage (Vercel Blob / CDN)
 * and keeps local browser cache in IndexedDB.
 */

import { saveMediaToIDB } from './mediaDB';
import { uploadToVercelBlob } from './vercelBlobStorage';

export interface UploadedFileResult {
  virtualPath: string;
  dataUrl: string;
  filename: string;
  isVideo: boolean;
}

export const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleanUrl = url.toLowerCase();
  return (
    cleanUrl.startsWith('data:video/') ||
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.includes('video/mp4') ||
    cleanUrl.includes('video/webm')
  );
};

export const readUploadedFile = async (
  file: File,
  sectionName: string
): Promise<UploadedFileResult> => {
  const sanitizedFolder = sectionName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isVideo = file.type.startsWith('video/') || isVideoUrl(file.name);

  // Upload file (PDF, MP4 video, PNG, JPEG) to Vercel Blob CDN
  const cdnUrl = await uploadToVercelBlob(file, sanitizedFolder);
  const mediaKey = `media_${sanitizedFolder}_${Date.now()}`;
  const virtualPath = cdnUrl.startsWith('http')
    ? cdnUrl
    : `uploads/${sanitizedFolder}/${file.name}`;

  // Also cache in local IndexedDB for instant offline preview
  await saveMediaToIDB(mediaKey, cdnUrl);

  return {
    virtualPath,
    dataUrl: cdnUrl,
    filename: file.name,
    isVideo
  };
};
