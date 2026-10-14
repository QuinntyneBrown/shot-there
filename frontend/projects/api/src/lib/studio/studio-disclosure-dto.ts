import { DisclosureKind } from './disclosure-kind';

export interface StudioDisclosureDto {
  kind: DisclosureKind;
  /** Who discounted or comped the session; null when paid in full. */
  provider: string | null;
}
