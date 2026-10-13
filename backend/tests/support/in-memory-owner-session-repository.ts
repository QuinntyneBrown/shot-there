import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import type { OwnerSessionRepository } from '@/lib/auth/owner-session-repository';

export class InMemoryOwnerSessionRepository implements OwnerSessionRepository {
  constructor(readonly rows: OwnerSessionRecord[] = []) {}

  async create(session: OwnerSessionRecord): Promise<void> {
    this.rows.push(structuredClone(session));
  }
}
