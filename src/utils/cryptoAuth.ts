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

export type AdminRole = 'admin' | 'superadmin';

export interface AdminAuthCredentials {
  username: string;
  passwordHash: string;
  role: AdminRole;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
}

// ─── Hashed credentials for regular admin ("admin" / "pczsc@aug2026") ───────
// SHA-256("pczsc@aug2026" + AUTH_SALT)
export const DEFAULT_ADMIN_HASH = '27312a405161a46236d974b943862101dd2546d22b3c9564e89e475ac57af746';

export const DEFAULT_ADMIN_AUTH: AdminAuthCredentials = {
  username: 'admin',
  passwordHash: DEFAULT_ADMIN_HASH,
  role: 'admin',
  updatedAt: new Date().toISOString()
};

// ─── Hashed credentials for super admin ("srikantsr" / "Aryan@220880#") ─────
// SHA-256("Aryan@220880#" + AUTH_SALT) — immutable, hardcoded for security
export const SUPER_ADMIN_USERNAME = 'srikantsr';
export const SUPER_ADMIN_HASH = 'c4f5810d37fcf4bc77d2cef2f61d8003b473201fde5740414b787c25f00da589';
