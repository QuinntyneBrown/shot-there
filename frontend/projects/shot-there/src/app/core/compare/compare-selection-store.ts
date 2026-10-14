import { CompareSelectionItem } from './compare-selection-item';

const STORAGE_KEY = 'st.compare';

/** Reads and writes the compare selection in localStorage; any storage failure means an empty selection. */
export const CompareSelectionStore = {
  load(): CompareSelectionItem[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(stored)
        ? stored.filter(
            (item): item is CompareSelectionItem =>
              typeof item?.slug === 'string' && typeof item?.name === 'string',
          )
        : [];
    } catch {
      return [];
    }
  },

  save(items: CompareSelectionItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage is full or blocked: the selection lasts for this page only.
    }
  },
};
