import { Locator, Page } from '@playwright/test';

/** An st-description-list: a dl.kv of dt/dd pairs, found within a scope. */
export class DescriptionListComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator) {
    this.root = scope.locator('dl.kv');
  }

  /** The terms, in order. */
  terms(): Promise<string[]> {
    return this.root.locator('> dt').allInnerTexts();
  }

  /** The detail of the pair whose term is given: dd text, and the classes of its parts. */
  detail(term: string): Locator {
    return this.root.locator('dt', { hasText: term }).locator('xpath=following-sibling::dd[1]');
  }

  numericPart(term: string): Locator {
    return this.detail(term).locator('span.num');
  }

  badge(term: string): Locator {
    return this.detail(term).locator('.badge');
  }

  hiddenSuffix(term: string): Locator {
    return this.detail(term).locator('.visually-hidden');
  }

  /** Whether every dt and dd is a direct child of the dl (no wrapping divs). */
  async isFlat(): Promise<boolean> {
    return this.root.evaluate((dl) =>
      [...dl.children].every((child) => child.tagName === 'DT' || child.tagName === 'DD'),
    );
  }

  /** The tabular-figures setting of the numeric part. */
  numericFeature(term: string): Promise<string> {
    return this.numericPart(term).evaluate((el) => getComputedStyle(el).fontVariantNumeric);
  }
}
