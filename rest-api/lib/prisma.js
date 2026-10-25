import 'dotenv/config';
// NOTE: `.ts` extension is intentional — Node type-stripping resolves the
// generated Prisma client. Do not "fix" this to `.js`.
import { PrismaClient } from '../prisma/generated/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({ adapter });
