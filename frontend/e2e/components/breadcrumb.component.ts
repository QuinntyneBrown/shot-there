import { Locator, Page } from '@playwright/test';

/** An st-breadcrumb: a nav holding an ol.breadcrumb, named by its label. */
export class BreadcrumbComponent {
  readonly nav: Locator;

  constructor(page: Page, label: string) {
    this.nav = page.getByRole('navigation', { name: label, exact: true });
  }

  /** The text of each crumb, in order. */
  crumbs(): Promise<string[]> {
    return this.nav.locator('li').allInnerTexts();
  }

  current(): Locator {
    return this.nav.locator('[aria-current="page"]');
  }

  links(): Locator {
    return this.nav.getByRole('link');
  }
}
