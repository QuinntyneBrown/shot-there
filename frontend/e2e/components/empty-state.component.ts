import { Locator, Page } from '@playwright/test';

/** An st-empty-state: the .empty block, found by its title heading. */
export class EmptyStateComponent {
  readonly root: Locator;
  readonly title: Locator;

  constructor(scope: Page | Locator, title: string) {
    this.title = scope.getByRole('heading', { name: title, exact: true });
    this.root = scope.locator('.empty').filter({ has: this.title });
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('empty'));
  }

  /** The heading level of the title. */
  titleLevel(): Promise<number> {
    return this.title.evaluate((el) => Number(el.tagName.slice(1)));
  }

  icon(): Locator {
    return this.root.locator('.empty__icon');
  }

  actions(): Locator {
    return this.root.locator('.empty__actions');
  }

  /** The accessible names of the actions, in order. */
  async actionNames(): Promise<string[]> {
    return this.actions().locator('a, button').allInnerTexts();
  }

  text(): Locator {
    return this.root.locator('.empty__text');
  }
}
