import { Locator, Page } from '@playwright/test';
import { IconComponent } from './icon.component';

/** An a[st-link]: a native link, found by its accessible name. */
export class LinkComponent {
  readonly root: Locator;
  readonly icon: IconComponent;

  constructor(scope: Page | Locator, name: string) {
    this.root = scope.getByRole('link', { name, exact: true });
    this.icon = new IconComponent(this.root);
  }

  /** The DS link modifiers on the element (.link--standalone, .link--external). */
  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('link--'));
  }

  async height(): Promise<number> {
    return Math.round((await this.root.boundingBox())?.height ?? 0);
  }

  /** Text colour and underline. */
  look(): Promise<{ colour: string; underline: boolean }> {
    return this.root.evaluate((el) => {
      const style = getComputedStyle(el);
      return { colour: style.color, underline: style.textDecorationLine.includes('underline') };
    });
  }
}
