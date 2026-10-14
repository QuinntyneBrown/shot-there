import { Locator, Page } from '@playwright/test';

/** An st-skeleton: a .skeleton placeholder, found by shape modifier within a scope. */
export class SkeletonComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, shape: 'text' | 'title' | 'pill' | 'rect' | 'circle') {
    this.root = scope.locator(`.skeleton--${shape}`);
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('skeleton'));
  }

  /** Rounded ends: the computed border radius of the first corner. */
  radius(): Promise<string> {
    return this.root.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  }
}
