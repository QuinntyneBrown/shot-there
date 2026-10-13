import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';

export interface OwnerSessionRepository {
  create(session: OwnerSessionRecord): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<OwnerSessionRecord | null>;
  touch(id: string, lastSeenAt: Date): Promise<void>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
}
