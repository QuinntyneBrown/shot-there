import { Locator, Page } from '@playwright/test';

/** A p[st-inline-message]: a .field__help or .field__error line found by its text. */
export class InlineMessageComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, text: string) {
    this.root = scope.locator('p.field__help, p.field__error', { hasText: text });
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('field__'));
  }

  /** The colour of the text. */
  colour(): Promise<string> {
    return this.root.evaluate((el) => getComputedStyle(el).color);
  }
}
