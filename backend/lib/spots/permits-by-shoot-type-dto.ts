import type { PermitRequirement } from '@/lib/spots/permit-requirement';

/** Whether each shoot type needs a permit at the spot (ICD §13.4). */
export interface PermitsByShootTypeDto {
  portrait: PermitRequirement;
  weddingEngagement: PermitRequirement;
  commercial: PermitRequirement;
  video: PermitRequirement;
}
