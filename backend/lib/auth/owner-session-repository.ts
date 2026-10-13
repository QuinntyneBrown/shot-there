import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';

export interface OwnerSessionRepository {
  create(session: OwnerSessionRecord): Promise<void>;
}
