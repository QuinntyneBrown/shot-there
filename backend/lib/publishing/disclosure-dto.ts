import type { Disclosure } from '@/lib/publishing/disclosure';

export interface DisclosureDto {
  kind: Disclosure;
  provider: string | null;
}
