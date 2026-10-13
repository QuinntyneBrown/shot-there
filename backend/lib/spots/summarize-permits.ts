import type { PermitRequirementRecord } from '@/lib/spots/permit-requirement-record';
import type { PermitSummary } from '@/lib/spots/permit-summary';

export function summarizePermits(permits: PermitRequirementRecord[]): PermitSummary {
  if (permits.length === 0) return 'unknown';
  if (permits.every((permit) => !permit.required)) return 'noneRequired';
  if (permits.every((permit) => permit.required)) return 'allRequired';
  return 'someRequired';
}
