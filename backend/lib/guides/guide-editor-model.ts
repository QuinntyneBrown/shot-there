import type { GuideEditorEntry } from '@/lib/guides/guide-editor-entry';
import type { GuideRecord } from '@/lib/guides/guide-record';

/** One guide of any status with its entries' location names, for the owner's editor. */
export interface GuideEditorModel extends Omit<GuideRecord, 'entries'> {
  entries: GuideEditorEntry[];
}
