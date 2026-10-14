import type { SpotGuideEntryDto } from '@/lib/guides/spot-guide-entry-dto';
import type { StudioGuideEntryDto } from '@/lib/guides/studio-guide-entry-dto';

/** One guide entry, discriminated on `kind`. */
export type GuideEntryDto = StudioGuideEntryDto | SpotGuideEntryDto;
