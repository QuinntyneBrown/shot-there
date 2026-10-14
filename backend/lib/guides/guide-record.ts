import type { GuideDataPointKey } from '@/lib/guides/guide-data-point-key';
import type { GuideEntryRecord } from '@/lib/guides/guide-entry-record';
import type { LocationStatus } from '@/lib/publishing/location-status';

/** An editorial guide with its entries. */
export interface GuideRecord {
  id: string;
  slug: string;
  status: LocationStatus;
  title: string;
  summary: string | null;
  introduction: string | null;
  dataPoints: GuideDataPointKey[];
  publishedAt: Date | null;
  updatedAt: Date;
  entries: GuideEntryRecord[];
}
