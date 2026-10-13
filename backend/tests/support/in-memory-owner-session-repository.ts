import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import type { OwnerSessionRepository } from '@/lib/auth/owner-session-repository';

export class InMemoryOwnerSessionRepository implements OwnerSessionRepository {
  constructor(public rows: OwnerSessionRecord[] = []) {}

  async create(session: OwnerSessionRecord): Promise<void> {
    this.rows.push(structuredClone(session));
  }

  async findByTokenHash(tokenHash: string): Promise<OwnerSessionRecord | null> {
    return structuredClone(this.rows.find((row) => row.tokenHash === tokenHash) ?? null);
  }

  async touch(id: string, lastSeenAt: Date): Promise<void> {
    const row = this.rows.find((candidate) => candidate.id === id);
    if (row) row.lastSeenAt = lastSeenAt;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    this.rows = this.rows.filter((row) => row.tokenHash !== tokenHash);
  }
}
