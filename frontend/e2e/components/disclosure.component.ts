import { Locator, Page } from '@playwright/test';

/** An st-disclosure: the .disclosure callout with its title and statement. */
export class DisclosureComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator) {
    this.root = scope.locator('.disclosure');
  }

  title(): Locator {
    return this.root.locator('.disclosure__title');
  }

  statement(): Locator {
    return this.root.locator('p:not(.disclosure__title)');
  }

  icon(): Locator {
    return this.root.locator('svg.icon');
  }

  /** The left edge width in px. */
  edgeWidth(): Promise<number> {
    return this.root.evaluate((el) => parseFloat(getComputedStyle(el).borderLeftWidth));
  }
}
