import { Locator, Page } from '@playwright/test';

/** An st-site-footer: the .site-footer block with its footer nav. */
export class SiteFooterComponent {
  readonly root: Locator;
  readonly nav: Locator;

  constructor(page: Page, navLabel: string) {
    this.root = page.locator('.site-footer');
    this.nav = page.getByRole('navigation', { name: navLabel, exact: true });
  }

  copy(): Locator {
    return this.root.locator('.site-footer__copy');
  }
}
