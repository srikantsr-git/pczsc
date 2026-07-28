/**
 * File Upload & Media Storage Helper Utilities for PCZSC CMS
 * Handles smart image compression & section folder assignment (uploads/hero, uploads/gallery, etc.)
 * Saves media blobs into IndexedDB for persistent unlimited storage.
 */

import { saveMediaToIDB } from './mediaDB';

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

/**
 * Smart Canvas Image Compressor (resizes max 1280px, quality 0.75)
 * Reduces 5MB photos down to ~90KB-140KB Data URLs
 */
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    // Timeout fallback after 3 seconds to guarantee promise resolves
    const fallbackTimeout = setTimeout(() => {
      if (reader.result && typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        resolve('');
      }
    }, 3000);

    reader.onload = () => {
      const rawResult = reader.result as string;

      if (!file.type.startsWith('image/')) {
        clearTimeout(fallbackTimeout);
        resolve(rawResult);
        return;
      }

      const img = new Image();
      img.onload = () => {
        clearTimeout(fallbackTimeout);
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 960;
          let width = img.width || 800;
          let height = img.height || 600;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
            resolve(compressedDataUrl);
          } else {
            resolve(rawResult);
          }
        } catch (e) {
          console.warn("Canvas compression fallback:", e);
          resolve(rawResult);
        }
      };

      img.onerror = () => {
        clearTimeout(fallbackTimeout);
        resolve(rawResult);
      };

      img.src = rawResult;
    };

    reader.onerror = () => {
      clearTimeout(fallbackTimeout);
      resolve('');
    };

    reader.readAsDataURL(file);
  });
};

export const readUploadedFile = async (
  file: File,
  sectionName: string
): Promise<UploadedFileResult> => {
  const dataUrl = await compressImageFile(file);
  const sanitizedFolder = sectionName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const mediaKey = `media_${sanitizedFolder}_${Date.now()}`;
  const virtualPath = `uploads/${sanitizedFolder}/${file.name}`;
  const isVideo = file.type.startsWith('video/') || isVideoUrl(file.name);

  const finalUrl = dataUrl || URL.createObjectURL(file);

  // Save persistently in IndexedDB
  await saveMediaToIDB(mediaKey, finalUrl);

  return {
    virtualPath,
    dataUrl: finalUrl,
    filename: file.name,
    isVideo
  };
};
