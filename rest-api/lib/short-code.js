import crypto from 'node:crypto';

export const CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const CODE_LENGTH = 7;

export function generateCode() {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = '';

  for (const byte of bytes) {
    code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  }

  return code;
}

export function isValidHttpUrl(value) {
  return normalizeUrl(value) !== null;
}

export function normalizeUrl(value) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}
