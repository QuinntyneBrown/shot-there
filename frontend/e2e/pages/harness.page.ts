import AxeBuilder from '@axe-core/playwright';
import { Locator, Page } from '@playwright/test';

export type HarnessTheme = 'light' | 'dark';

/** A components-harness route: one library component state (ICD-002 D-12). */
export class HarnessPage {
  /** Console errors and uncaught exceptions, including hydration mismatches, since the page object was made. */
  readonly errors: string[] = [];

  constructor(readonly page: Page) {
    page.on('console', (message) => message.type() === 'error' && this.errors.push(message.text()));
    page.on('pageerror', (error) => this.errors.push(error.message));
  }

  /** Opens `<component>/<state>` at a viewport width (CSS px) in a colour scheme. */
  async open(path: string, options: { width?: number; theme?: HarnessTheme } = {}): Promise<void> {
    const { width = 1280, theme = 'light' } = options;
    await this.page.setViewportSize({ width, height: 800 });
    await this.page.emulateMedia({ colorScheme: theme });
    await this.page.goto(`/${path}`);
  }

  /** One example on a harness route: a `<section aria-label>` wrapping a component state. */
  example(name: string): Locator {
    return this.page.getByRole('region', { name, exact: true });
  }

  hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  }

  async accessibilityViolations(): Promise<string[]> {
    const results = await new AxeBuilder({ page: this.page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  }
}
