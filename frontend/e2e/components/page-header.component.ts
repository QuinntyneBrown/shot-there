import { Locator, Page } from '@playwright/test';

/** An st-page-header: the .page-header block with the page h1, a subtitle and actions. */
export class PageHeaderComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, title: string) {
    this.root = scope.locator('.page-header').filter({ has: scope.getByRole('heading', { level: 1, name: title, exact: true }) });
  }

  heading(): Locator {
    return this.root.getByRole('heading', { level: 1 });
  }

  subtitle(): Locator {
    return this.root.locator('.subtitle');
  }
}
