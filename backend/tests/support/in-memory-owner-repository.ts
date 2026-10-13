import type { OwnerRecord } from '@/lib/auth/owner-record';
import type { OwnerRepository } from '@/lib/auth/owner-repository';

export class InMemoryOwnerRepository implements OwnerRepository {
  constructor(readonly rows: OwnerRecord[] = []) {}

  async findByEmail(email: string): Promise<OwnerRecord | null> {
    return structuredClone(this.rows.find((row) => row.email.toLowerCase() === email.toLowerCase()) ?? null);
  }
}
