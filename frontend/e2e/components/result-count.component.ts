import { Locator, Page } from '@playwright/test';

/** An st-result-count: the .result-count live status line. */
export class ResultCountComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator) {
    this.root = scope.locator('.result-count');
  }

  /** The visually hidden suffix. */
  suffix(): Locator {
    return this.root.locator('.visually-hidden');
  }
}
