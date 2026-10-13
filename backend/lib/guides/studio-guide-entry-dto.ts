import type { GuideDataPointDto } from '@/lib/guides/guide-data-point-dto';
import type { StudioSummary } from '@/lib/studios/studio-summary';

export interface StudioGuideEntryDto {
  kind: 'studio';
  location: StudioSummary;
  /** In the guide's data point order. */
  dataPoints: GuideDataPointDto[];
  editorNote: string | null;
}
