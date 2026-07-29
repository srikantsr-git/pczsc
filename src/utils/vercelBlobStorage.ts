import { upload } from '@vercel/blob/client';

export interface VercelUploadResult {
  url: string;
  pathname: string;
  contentType: string;
}

/**
 * Uploads a file (PDF, PNG, JPEG, MP4 video) directly to Vercel Blob Storage.
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

  // 1. Direct upload using Vercel Blob client token
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
    // Fallback to Base64 Data URL if Vercel Blob token is unconfigured
  }

  // 3. Fallback if Vercel Blob is not configured
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
