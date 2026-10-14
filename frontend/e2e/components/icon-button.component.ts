import { Locator, Page } from '@playwright/test';
import { IconComponent } from './icon.component';

/** A button[st-icon-button] or a[st-icon-button]: the DS .icon-btn, found by role and its aria-label. */
export class IconButtonComponent {
  readonly root: Locator;
  readonly icon: IconComponent;

  constructor(scope: Page | Locator, label: string, role: 'button' | 'link' = 'button') {
    this.root = scope.getByRole(role, { name: label, exact: true });
    this.icon = new IconComponent(this.root);
  }

  /** The DS classes on the element: the block first, then modifiers. */
  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('icon-btn'));
  }

  /** The rendered width and height in whole CSS pixels. */
  async size(): Promise<{ width: number; height: number }> {
    const box = await this.root.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** The edge: width in px and style. */
  border(): Promise<{ width: number; style: string }> {
    return this.root.evaluate((el) => {
      const style = getComputedStyle(el);
      return { width: parseFloat(style.borderTopWidth), style: style.borderTopStyle };
    });
  }

  /** The glyph colour (the icon draws in currentColor). */
  glyphColour(): Promise<string> {
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
