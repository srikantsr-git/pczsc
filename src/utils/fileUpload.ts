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

export const compressImageFile = (
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.75
): Promise<File> => {
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

export const readUploadedFile = async (
  file: File,
  sectionName: string
): Promise<UploadedFileResult> => {
  const sanitizedFolder = sectionName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isVideo = file.type.startsWith('video/') || isVideoUrl(file.name);

  // Compress image to web format (1920x1080 JPEG ~150KB) before uploading
  const fileToUpload = isVideo ? file : await compressImageFile(file);

  // Upload file (PDF, MP4 video, PNG, JPEG) to Vercel Blob CDN
  const cdnUrl = await uploadToVercelBlob(fileToUpload, sanitizedFolder);
  const mediaKey = `media_${sanitizedFolder}_${Date.now()}`;
  const virtualPath = cdnUrl.startsWith('http')
    ? cdnUrl
    : `uploads/${sanitizedFolder}/${file.name}`;

  if (!cdnUrl.startsWith('http') && cdnUrl.length > 0) {
    await saveMediaToIDB(mediaKey, cdnUrl);
  }

  return {
    virtualPath,
    dataUrl: cdnUrl,
    filename: file.name,
    isVideo
  };
};
