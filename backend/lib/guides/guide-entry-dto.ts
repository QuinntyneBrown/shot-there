import type { GuideDataPointDto } from '@/lib/guides/guide-data-point-dto';
import type { LocationCardDto } from '@/lib/guides/location-card-dto';
import type { LocationKind } from '@/lib/publishing/location-kind';

export interface GuideEntryDto {
  position: number;
  kind: LocationKind;
  location: LocationCardDto;
  dataPoints: GuideDataPointDto[];
  editorNote: string;
}
