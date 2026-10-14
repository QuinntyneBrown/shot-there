import { Locator, Page } from '@playwright/test';

/** An st-badge: a .badge pill found by its word. */
export class BadgeComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, text: string) {
    this.root = scope.locator('.badge', { hasText: text });
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('badge'));
  }

  colours(): Promise<{ colour: string; background: string }> {
    return this.root.evaluate((el) => {
      const style = getComputedStyle(el);
      return { colour: style.color, background: style.backgroundColor };
    });
  }
}
