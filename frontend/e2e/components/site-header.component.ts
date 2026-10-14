import { Locator, Page } from '@playwright/test';

/** An st-site-header: the .site-header bar with its wordmark, primary nav and menu button. */
export class SiteHeaderComponent {
  readonly root: Locator;
  readonly nav: Locator;
  readonly menuButton: Locator;

  constructor(page: Page, navLabel: string, menuLabel = 'Menu') {
    this.root = page.locator('.site-header');
    this.nav = page.getByRole('navigation', { name: navLabel, exact: true });
    this.menuButton = page.getByRole('button', { name: menuLabel, exact: true });
  }

  wordmark(): Locator {
    return this.root.locator('.wordmark');
  }

  link(name: string): Locator {
    return this.nav.getByRole('link', { name });
  }
}
