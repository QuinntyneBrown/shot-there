import { Injectable, afterNextRender, computed, signal } from '@angular/core';

import { CompareAddResult } from './compare-add-result';
import { CompareSelectionItem } from './compare-selection-item';
import { CompareSelectionStore } from './compare-selection-store';

export const COMPARE_LIMIT = 4;
export const COMPARE_MINIMUM = 2;

/** The studios a visitor has picked to compare, kept in the browser. */
@Injectable({ providedIn: 'root' })
export class CompareSelectionService {
  private readonly selection = signal<CompareSelectionItem[]>([]);

  readonly items = this.selection.asReadonly();
  readonly count = computed(() => this.selection().length);
  readonly canCompare = computed(() => this.count() >= COMPARE_MINIMUM);
  readonly isFull = computed(() => this.count() >= COMPARE_LIMIT);

  constructor() {
    // Read storage only in the browser, after hydration, so the server and first client render match.
    afterNextRender(() => this.selection.set(CompareSelectionStore.load().slice(0, COMPARE_LIMIT)));
  }

  has(slug: string): boolean {
    return this.selection().some((item) => item.slug === slug);
  }

  add(item: CompareSelectionItem): CompareAddResult {
    if (this.has(item.slug)) {
      return 'already-selected';
    }
    if (this.isFull()) {
      return 'limit-reached';
    }
    this.update([...this.selection(), item]);
    return 'added';
  }

  remove(slug: string): void {
    this.update(this.selection().filter((item) => item.slug !== slug));
  }

  clear(): void {
    this.update([]);
  }

  private update(items: CompareSelectionItem[]): void {
    this.selection.set(items);
    CompareSelectionStore.save(items);
  }
}
