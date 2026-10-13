import type { Disclosure } from '@/lib/publishing/disclosure';

export interface DisclosureDto {
  kind: Disclosure | null;
  provider: string | null;
}
