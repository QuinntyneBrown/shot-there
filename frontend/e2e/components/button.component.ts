import { Locator, Page } from '@playwright/test';
import { IconComponent } from './icon.component';

/** A button[st-button] or a[st-button]: the DS .btn, found by role and accessible name. */
export class ButtonComponent {
  readonly root: Locator;
  readonly icon: IconComponent;

  constructor(scope: Page | Locator, name: string | RegExp, role: 'button' | 'link' = 'button') {
    this.root = scope.getByRole(role, { name, exact: true });
    this.icon = new IconComponent(this.root);
  }

  /** The DS classes on the element, in order: the block first, then modifiers. */
  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('btn'));
  }

  /** The rendered width and height in whole CSS pixels. */
  async size(): Promise<{ width: number; height: number }> {
    const box = await this.root.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** The focus outline the element shows now: width in px, style, and colour. */
  focusRing(): Promise<{ width: number; style: string }> {
    return this.root.evaluate((el) => {
      const style = getComputedStyle(el);
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle };
    });
  }

  /** The text colour; a busy button hides its label by making it transparent. */
  labelColour(): Promise<string> {
    return this.root.evaluate((el) => getComputedStyle(el).color);
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async press(key: string): Promise<void> {
    await this.root.focus();
    await this.root.press(key);
  }
}
