import type { PermitRequirementRecord } from '@/lib/spots/permit-requirement-record';
import type { PermitsByShootTypeDto } from '@/lib/spots/permits-by-shoot-type-dto';
import type { ShootType } from '@/lib/spots/shoot-type';

/** The permit requirement for every shoot type, or null while any shoot type has none recorded. */
export function toPermitsByShootType(permits: PermitRequirementRecord[]): PermitsByShootTypeDto | null {
  const requirement = (shootType: ShootType) => {
    const permit = permits.find((candidate) => candidate.shootType === shootType);
    return permit ? (permit.required ? 'required' : 'not_required') : null;
  };
  const portrait = requirement('portrait');
  const weddingEngagement = requirement('weddingEngagement');
  const commercial = requirement('commercial');
  const video = requirement('video');
  if (!portrait || !weddingEngagement || !commercial || !video) return null;
  return { portrait, weddingEngagement, commercial, video };
}
