/**
 * Input Security & SQL Injection Protection Utilities
 */

// Common SQL Injection Patterns & Malicious Payload Signatures
const SQL_INJECTION_REGEX = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|DECLARE|UNION|GRANT|REVOKE)\b)|('--')|(\/\*)|(\*\/)|(\bOR\b\s+['"]?1['"]?\s*=\s*['"]?1)|(\bAND\b\s+['"]?1['"]?\s*=\s*['"]?1)|(;)/i;

// Dangerous Script Tags & HTML Signature Regex
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
 * Checks whether the input string contains SQL Injection patterns
 */
export function containsSqlInjection(input: string): boolean {
  if (!input) return false;
  return SQL_INJECTION_REGEX.test(input);
}

/**
 * Sanitizes input text by stripping script tags, unescaped quotes, and dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(SCRIPT_REGEX, '')
    .replace(/['"\\]/g, '') // strip unescaped quotes & backslashes
    .trim();
}

/**
 * Validates Email format strictly
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates 10 to 12 digit Phone Numbers
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
  return /^[0-9]{10,12}$/.test(cleanPhone);
}
