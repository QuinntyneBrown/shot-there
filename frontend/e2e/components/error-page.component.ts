import { Locator, Page } from '@playwright/test';

/** An st-error-page: the .system-page block with its h1. */
export class ErrorPageComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator) {
    this.root = scope.locator('.system-page');
  }

  heading(): Locator {
    return this.root.getByRole('heading', { level: 1 });
  }

  code(): Locator {
    return this.root.locator('.system-page__code').first();
  }

  /** Every direct child's text, in reading order, as a flat list of lines. */
  async lines(): Promise<string[]> {
    return this.root
      .locator(':scope > *')
      .evaluateAll((els) => els.map((el) => (el.textContent ?? '').trim()));
  }

  actions(): Locator {
    return this.root.locator('.system-page__actions').getByRole('link');
  }

  /** The system-page classes. */
  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('system-page'));
  }
}
