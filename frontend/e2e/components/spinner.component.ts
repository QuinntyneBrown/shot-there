import { Locator, Page } from '@playwright/test';

/** An st-spinner: the .spinner ring plus its visually hidden label. */
export class SpinnerComponent {
  readonly ring: Locator;

  constructor(scope: Page | Locator, ringIndex: number) {
    this.ring = scope.locator('.spinner').nth(ringIndex);
  }

  /** The ring classes. */
  async classes(): Promise<string[]> {
    return ((await this.ring.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('spinner'));
  }

  /** Layout size, unaffected by the turning. */
  size(): Promise<{ width: number; height: number }> {
    return this.ring.evaluate((el) => ({ width: (el as HTMLElement).offsetWidth, height: (el as HTMLElement).offsetHeight }));
  }

  /** The ring border width in px. */
  borderWidth(): Promise<number> {
    return this.ring.evaluate((el) => parseFloat(getComputedStyle(el).borderTopWidth));
  }

  /** The hidden label that follows the ring. */
  label(): Locator {
    return this.ring.locator('xpath=following-sibling::*[contains(@class,"visually-hidden")]');
  }
}
