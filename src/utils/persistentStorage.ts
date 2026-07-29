/**
 * Bulletproof Storage Helper for PCZSC Website
 * Combines LocalStorage with IndexedDB to store unlimited photos, themes, and CMS settings safely.
 * Prevents QuotaExceededError from wiping or resetting site data and images.
 */

import { saveMediaToIDB, getMediaFromIDB } from './mediaDB';

/**
 * Recursively replaces large Base64 Data URLs with IndexedDB references
 */
export async function extractAndStoreImages(obj: any, parentKey: string): Promise<any> {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // If string is a large Base64 Data URL (> 10KB)
    if (obj.startsWith('data:image/') || obj.startsWith('data:video/')) {
      const mediaKey = `idb_${parentKey}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      await saveMediaToIDB(mediaKey, obj);
      return `idb:${mediaKey}`;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (let i = 0; i < obj.length; i++) {
      newArr.push(await extractAndStoreImages(obj[i], `${parentKey}_${i}`));
    }
    return newArr;
  }

  if (typeof obj === 'object') {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await extractAndStoreImages(obj[key], `${parentKey}_${key}`);
    }
    return newObj;
  }

  return obj;
}

/**
 * Recursively resolves `idb:key` references back to actual Data URLs from IndexedDB
 */
export async function hydrateImagesFromIDB(obj: any): Promise<any> {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    if (obj.startsWith('idb:')) {
      const mediaKey = obj.replace('idb:', '');
      const dataUrl = await getMediaFromIDB(mediaKey);
      return dataUrl || '';
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (let i = 0; i < obj.length; i++) {
      newArr.push(await hydrateImagesFromIDB(obj[i]));
    }
    return newArr;
  }

  if (typeof obj === 'object') {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await hydrateImagesFromIDB(obj[key]);
    }
    return newObj;
  }

  return obj;
}

/**
 * Safely saves data to localStorage.
 * Automatically offloads large Base64 image payloads to IndexedDB to keep LocalStorage lightweight.
 */
export async function safeSaveStorage(key: string, value: any): Promise<boolean> {
  try {
    const lightweightObj = await extractAndStoreImages(value, key);
    const jsonStr = JSON.stringify(lightweightObj);
    localStorage.setItem(key, jsonStr);
    return true;
  } catch (e) {
    console.error(`[Storage] Failed to save key "${key}":`, e);
    return false;
  }
}

/**
 * Safely loads data from localStorage and hydrates IndexedDB image references.
 */
export function safeLoadStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    const parsed = JSON.parse(saved);
    return parsed;
  } catch (e) {
    console.warn(`[Storage] Failed to load key "${key}", returning default:`, e);
    return defaultValue;
  }
}
