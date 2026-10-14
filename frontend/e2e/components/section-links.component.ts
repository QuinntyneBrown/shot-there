import { Locator, Page } from '@playwright/test';

/** An st-section-links: a nav of .section-link rows. */
export class SectionLinksComponent {
  readonly nav: Locator;

  constructor(page: Page, navLabel: string) {
    this.nav = page.getByRole('navigation', { name: navLabel, exact: true });
  }

  row(title: string): Locator {
    return this.nav.locator('.section-link', { hasText: title });
  }
}
