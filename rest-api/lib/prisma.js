import 'dotenv/config';
// NOTE: `.ts` extension is intentional — Node type-stripping resolves the
// generated Prisma client. Do not "fix" this to `.js`.
import { PrismaClient } from '../prisma/generated/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma;

// Lazily create the client so importing the app (e.g. in tests) does not
// require DATABASE_URL. The error is still raised on the first DB access.
export function getPrisma() {
  if (prisma) return prisma;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  prisma = new PrismaClient({ adapter });
  return prisma;
}
