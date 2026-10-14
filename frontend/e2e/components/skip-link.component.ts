import { Locator, Page } from '@playwright/test';

/** An st-skip-link: the .skip-link anchor, first in the tab order. */
export class SkipLinkComponent {
  readonly root: Locator;

  constructor(scope: Page, label = 'Skip to content') {
    this.root = scope.getByRole('link', { name: label, exact: true });
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('skip-link'));
  }

  /** The top edge of the link relative to the viewport. */
  async top(): Promise<number> {
    return Math.round((await this.root.boundingBox())?.y ?? 0);
  }
}
