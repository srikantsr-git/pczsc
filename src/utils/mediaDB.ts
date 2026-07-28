/**
 * IndexedDB Media Storage Utility for PCZSC Website
 * Provides gigabytes of persistent local storage for high-res uploaded photos & media,
 * bypassing browser 5MB localStorage limits.
 */

const DB_NAME = 'pczsc_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported in this browser.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const mediaCache = new Map<string, string>();

/**
 * Saves a photo data URL or Blob into IndexedDB by Key
 */
export async function saveMediaToIDB(key: string, dataUrl: string): Promise<boolean> {
  if (dataUrl) {
    mediaCache.set(key, dataUrl);
  }
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save warning:', err);
    return false;
  }
}

/**
 * Retrieves photo data URL from IndexedDB by Key
 */
export async function getMediaFromIDB(key: string): Promise<string | null> {
  if (mediaCache.has(key)) {
    return mediaCache.get(key) || null;
  }
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        const result = req.result || null;
        if (result) {
          mediaCache.set(key, result);
        }
        resolve(result);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read warning:', err);
    return null;
  }
}

/**
 * Deletes media entry from IndexedDB
 */
export async function deleteMediaFromIDB(key: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete warning:', err);
    return false;
  }
}
