import type { GuideEntryRecord } from '@/lib/guides/guide-entry-record';

/** A guide entry with its location's name, for the owner's editor. */
export interface GuideEditorEntry extends GuideEntryRecord {
  name: string;
}
