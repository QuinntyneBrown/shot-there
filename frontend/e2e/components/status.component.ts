import { Locator, Page } from '@playwright/test';

/** An st-status: a .status label (word plus shape) found by its word. */
export class StatusComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, text: string) {
    this.root = scope.locator('.status', { hasText: text });
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('status'));
  }

  /** The ::before shape: its fill and border. */
  shape(): Promise<{
    background: string;
    borderWidth: number;
    borderColour: string;
    colour: string;
  }> {
    return this.root.evaluate((el) => {
      const before = getComputedStyle(el, '::before');
      return {
        background: before.backgroundColor,
        borderWidth: parseFloat(before.borderTopWidth),
        borderColour: before.borderTopColor,
        colour: getComputedStyle(el).color,
      };
    });
  }
}
