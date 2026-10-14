import { Locator, Page } from '@playwright/test';

/** The st-toast-region: the polite live region holding .toast items. */
export class ToastComponent {
  readonly region: Locator;

  constructor(page: Page) {
    this.region = page.locator('.toast-region');
  }

  toasts(): Locator {
    return this.region.locator('.toast');
  }

  toast(title: string): Locator {
    return this.toasts().filter({ hasText: title });
  }

  async classes(title: string): Promise<string[]> {
    return ((await this.toast(title).getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('toast'))
      .sort();
  }
}
