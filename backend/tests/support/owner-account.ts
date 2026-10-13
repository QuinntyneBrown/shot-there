import argon2 from 'argon2';
import type { OwnerRecord } from '@/lib/auth/owner-record';

export const OWNER_EMAIL = 'owner@shotthere.ca';
export const OWNER_PASSWORD = 'correct horse battery staple';

let passwordHash: Promise<string> | undefined;

/** The single owner account, its password hashed with argon2id. */
export async function anOwner(): Promise<OwnerRecord> {
  passwordHash ??= argon2.hash(OWNER_PASSWORD, { type: argon2.argon2id });
  return { id: 'owner-1', email: OWNER_EMAIL, passwordHash: await passwordHash };
}
