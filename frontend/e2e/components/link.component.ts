import { Locator, Page } from '@playwright/test';
import { colourOf } from './contrast';
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

  /** Text colour as rgb(r, g, b), whether it is underlined, and the underline's thickness and offset in px. */
  async look(): Promise<{ colour: string; underline: boolean; thickness: number; offset: number }> {
    const colour = await this.root.evaluate(colourOf, 'color');
    return this.root.evaluate((el, c) => {
      const style = getComputedStyle(el);
      return {
        colour: c,
        underline: style.textDecorationLine.includes('underline'),
        thickness: parseFloat(style.textDecorationThickness),
        offset: Math.round(parseFloat(style.textUnderlineOffset) * 10) / 10,
      };
    }, colour);
  }

  async hover(): Promise<void> {
    await this.root.hover();
  }
}
