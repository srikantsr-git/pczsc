/**
 * Cryptographic Authentication & Password Hashing Utilities for PCZSC CMS
 * Uses Web Crypto API (SHA-256 + Salt) for zero-dependency secure password hashing.
 */

const AUTH_SALT = 'pczsc_secret_salt_v2026_sports';

/**
 * Computes SHA-256 Cryptographic Hash of a input string with Salt
 */
export async function hashPassword(plainText: string): Promise<string> {
  if (!plainText) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + AUTH_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export interface AdminAuthCredentials {
  username: string;
  passwordHash: string;
  updatedAt: string;
}

// Hashed credentials for default initial state ("admin" / "admin123")
export const DEFAULT_ADMIN_HASH = '58057636bcef2aed0c4910721af54e41700f2fb8bf93567ae87fca3b00e04f0f';

export const DEFAULT_ADMIN_AUTH: AdminAuthCredentials = {
  username: 'admin',
  passwordHash: DEFAULT_ADMIN_HASH,
  updatedAt: new Date().toISOString()
};
