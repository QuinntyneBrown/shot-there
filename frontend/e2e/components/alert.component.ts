import { Locator, Page } from '@playwright/test';

/** An st-alert: the .alert block, found by its title or its body text. */
export class AlertComponent {
  readonly root: Locator;

  constructor(scope: Page, text: string) {
    this.root = scope.locator('.alert', { hasText: text });
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('alert') || c === 'banner')
      .sort();
  }

  title(): Locator {
    return this.root.locator('.alert__title');
  }

  dismissButton(): Locator {
    return this.root.getByRole('button', { name: 'Dismiss', exact: true });
  }
}
