/**
 * Creates the single owner account, or sets its password, from OWNER_EMAIL and OWNER_PASSWORD.
 * Signs out every existing session of that owner. Usage: npm run owner:set-password
 */
import argon2 from 'argon2';
import { prismaClient } from '@/lib/data/prisma-client';

async function main(): Promise<void> {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD?.trim();
  if (!email || !password) throw new Error('Set OWNER_EMAIL and OWNER_PASSWORD');

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  const prisma = prismaClient();
  const owner = await prisma.owner.upsert({ where: { email }, create: { email, passwordHash }, update: { passwordHash } });
  await prisma.ownerSession.deleteMany({ where: { ownerId: owner.id } });
  await prisma.$disconnect();
  console.log(`Owner password set for ${email}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
