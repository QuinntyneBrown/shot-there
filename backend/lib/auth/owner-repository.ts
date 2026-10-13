import type { OwnerRecord } from '@/lib/auth/owner-record';

export interface OwnerRepository {
  /** The owner with the email, matched case-insensitively, or null. */
  findByEmail(email: string): Promise<OwnerRecord | null>;
}
