import { Locator, Page } from '@playwright/test';

/** An st-tag-list: a .tags list of .tag items, found by its aria-label or its section heading. */
export class TagListComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, name?: string) {
    this.root = name ? scope.getByRole('list', { name, exact: true }) : scope.locator('.tags');
  }

  /** The text of each tag, in order. */
  tags(): Promise<string[]> {
    return this.root.locator('.tag').allInnerTexts();
  }

  /** The links among the tags: their text and href. */
  links(): Promise<{ text: string; href: string | null }[]> {
    return this.root
      .getByRole('link')
      .evaluateAll((els) =>
        els.map((el) => ({ text: el.textContent ?? '', href: el.getAttribute('href') })),
      );
  }

  async rootClasses(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/);
  }
}
