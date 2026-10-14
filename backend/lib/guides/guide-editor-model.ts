import type { GuideDataPointKey } from '@/lib/guides/guide-data-point-key';
import type { GuideEditorEntry } from '@/lib/guides/guide-editor-entry';
import type { LocationStatus } from '@/lib/publishing/location-status';

/** A guide of any status as the owner's editor reads it (ICD §13.12). */
export interface GuideEditorModel {
  id: string;
  slug: string;
  status: LocationStatus;
  publishedAt: string | null;
  updatedAt: string;
  title: string;
  summary: string | null;
  introduction: string | null;
  dataPoints: GuideDataPointKey[];
  entries: GuideEditorEntry[];
}
