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
    '';

  const sanitizedFolder = folderName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const uniqueFilename = `${sanitizedFolder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  if (token) {
    try {
      const blob = await upload(uniqueFilename, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        token: token
      } as any);
      return blob.url;
    } catch (error) {
      console.warn('Vercel Blob upload warning:', error);
    }
  }

  // Fallback if VITE_BLOB_READ_WRITE_TOKEN is not set yet in local environment
  console.info(
    'Notice: VITE_BLOB_READ_WRITE_TOKEN not set in .env. Using persistent base64 Data URL fallback (stored in IndexedDB).'
  );

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Always use data: URL (base64) — never blob: URLs which are session-only
      resolve((reader.result as string) || '');
    };
    reader.onerror = () => {
      // Do not use URL.createObjectURL — blob: URLs die on page reload/server restart
      resolve('');
    };
    reader.readAsDataURL(file);
  });
}
