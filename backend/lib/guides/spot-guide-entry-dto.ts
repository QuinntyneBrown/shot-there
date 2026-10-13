import type { GuideDataPointDto } from '@/lib/guides/guide-data-point-dto';
import type { SpotSummary } from '@/lib/spots/spot-summary';

export interface SpotGuideEntryDto {
  kind: 'spot';
  location: SpotSummary;
  /** Empty until a spot data point key exists. */
  dataPoints: GuideDataPointDto[];
  editorNote: string | null;
}
