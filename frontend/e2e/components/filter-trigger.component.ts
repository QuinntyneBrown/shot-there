import { Locator, Page } from '@playwright/test';
import { IconComponent } from './icon.component';

/** A button[st-filter-trigger] or a[st-filter-trigger]: the DS .filter-trigger pill, found by its accessible name. */
export class FilterTriggerComponent {
  readonly root: Locator;
  readonly icon: IconComponent;
  readonly count: Locator;

  constructor(scope: Page | Locator, name: string | RegExp = /^Filters/) {
    this.root = scope.getByRole('button', { name, exact: typeof name === 'string' });
    this.icon = new IconComponent(this.root);
    this.count = this.root.locator('.filter-trigger__count');
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('filter-trigger'));
  }

  async height(): Promise<number> {
    return Math.round((await this.root.boundingBox())?.height ?? 0);
  }

  /** The inset ink edge the DS draws while the trigger's dialog is open. */
  hasOpenEdge(): Promise<boolean> {
    return this.root.evaluate((el) => getComputedStyle(el).boxShadow !== 'none');
  }

  opacity(): Promise<number> {
    return this.root.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async press(key: string): Promise<void> {
    await this.root.focus();
    await this.root.press(key);
  }
}
