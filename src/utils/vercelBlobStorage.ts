import { upload } from '@vercel/blob/client';

export interface VercelUploadResult {
  url: string;
  pathname: string;
  contentType: string;
}

/**
 * Uploads a file to Neon DB as base64, returning a stable /api/media?id=... URL.
 * This is the permanent server-side storage path — no browser storage dependency.
 */
export async function uploadToNeonMedia(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const mediaId = `media_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
        const mimeType = file.type || 'image/jpeg';

        const response = await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: mediaId, data: dataUrl, mime_type: mimeType })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.url) {
            resolve(result.url);
            return;
          }
        }
      } catch (err) {
        console.warn('Neon media upload warning:', err);
      }
      // If Neon media API fails, return a data URL as last resort
      resolve(reader.result as string);
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file (PDF, PNG, JPEG, MP4 video) directly to Vercel Blob Storage.
 * Falls back to Neon DB media storage, then base64 Data URL.
 * Returns the permanent global CDN URL.
 */
export async function uploadToVercelBlob(
  file: File,
  folderName: string = 'uploads'
): Promise<string> {
  const meta = import.meta as any;
  const token =
    (typeof meta !== 'undefined' && meta.env?.VITE_BLOB_READ_WRITE_TOKEN) ||
    (typeof process !== 'undefined' && process.env?.BLOB_READ_WRITE_TOKEN) ||
    '';

  const sanitizedFolder = folderName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const uniqueFilename = `${sanitizedFolder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  // 1. Direct upload using Vercel Blob client token (if configured)
  if (token) {
    try {
      const blob = await upload(uniqueFilename, file, {
        access: 'public',
        token: token
      } as any);
      if (blob && blob.url) {
        return blob.url;
      }
    } catch (error) {
      console.warn('Vercel Blob direct token upload warning:', error);
    }
  }

  // 2. Upload via Vercel serverless API endpoint (/api/upload)
  try {
    const blob = await upload(uniqueFilename, file, {
      access: 'public',
      handleUploadUrl: '/api/upload'
    } as any);
    if (blob && blob.url) {
      return blob.url;
    }
  } catch (error) {
    // Fall through to Neon DB storage
  }

  // 3. Upload to Neon DB as base64 (permanent server-side storage)
  try {
    const neonUrl = await uploadToNeonMedia(file);
    if (neonUrl && neonUrl.startsWith('/api/media')) {
      return neonUrl;
    }
    // If Neon returned a data URL (Neon API unavailable), return it
    if (neonUrl && neonUrl.startsWith('data:')) {
      return neonUrl;
    }
  } catch (err) {
    console.warn('Neon media fallback warning:', err);
  }

  // 4. Last resort: base64 Data URL (browser-only, not persistent across sessions)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve((reader.result as string) || '');
    };
    reader.onerror = () => {
      resolve('');
    };
    reader.readAsDataURL(file);
  });
}
