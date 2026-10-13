import type { PermitRequirement } from '@/lib/spots/permit-requirement';

export interface PermitsByShootTypeInput {
  portrait: PermitRequirement | null;
  weddingEngagement: PermitRequirement | null;
  commercial: PermitRequirement | null;
  video: PermitRequirement | null;
}
