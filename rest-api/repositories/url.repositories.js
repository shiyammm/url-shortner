import { getPrisma } from '../lib/prisma.js';

export function findByOriginal(original) {
  return getPrisma().url.findFirst({ where: { original } });
}

export function findByShort(short) {
  return getPrisma().url.findUnique({ where: { short } });
}

export function createUrl(original, short) {
  return getPrisma().url.create({ data: { original, short } });
}
