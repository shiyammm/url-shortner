import { prisma } from '../lib/prisma.js';

export function findByOriginal(original) {
  return prisma.url.findFirst({ where: { original } });
}

export function findByShort(short) {
  return prisma.url.findUnique({ where: { short } });
}

export function createUrl(original, short) {
  return prisma.url.create({ data: { original, short } });
}
