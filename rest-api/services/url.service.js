// Docker cache learning experiment
import * as urlRepo from '../repositories/url.repositories.js';
import { httpError, toServiceError } from '../lib/errors.js';
import { generateCode, normalizeUrl } from '../lib/short-code.js';

const MAX_RETRIES = 5;

export async function createShortUrl(link) {
  if (typeof link !== 'string' || !link.trim()) {
    throw httpError(400, 'link is required');
  }

  const canonical = normalizeUrl(link);
  if (!canonical) {
    throw httpError(400, 'Invalid URL. Use http(s)://...');
  }

  let existing;
  try {
    existing = await urlRepo.findByOriginal(canonical);
  } catch (err) {
    console.log(err);
    throw toServiceError(err, 'Failed to shorten URL');
  }

  if (existing) {
    return { url: existing, created: false };
  }

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const created = await urlRepo.createUrl(canonical, generateCode());
      return { url: created, created: true };
    } catch (err) {
      if (err?.code === 'P2002') continue;
      console.log(err);
      throw toServiceError(err, 'Failed to shorten URL');
    }
  }

  throw httpError(500, 'Could not generate a unique code, try again');
}

export async function resolveShort(short) {
  let row;
  try {
    row = await urlRepo.findByShort(short);
  } catch (err) {
    throw toServiceError(err, 'Failed to resolve short URL');
  }

  if (!row) {
    throw httpError(404, 'Short URL not found');
  }

  return row;
}
