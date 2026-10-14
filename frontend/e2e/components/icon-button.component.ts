import { Locator, Page } from '@playwright/test';
import { colourOf, ColourPart, contrastOf } from './contrast';
import { IconComponent } from './icon.component';

/** A button[st-icon-button] or a[st-icon-button]: the DS .icon-btn, found by role and its aria-label. */
export class IconButtonComponent {
  readonly root: Locator;
  readonly icon: IconComponent;

  constructor(scope: Page | Locator, label: string, role: 'button' | 'link' = 'button') {
    this.root = scope.getByRole(role, { name: label, exact: true });
    this.icon = new IconComponent(this.root);
  }

  /** Every class on the element. */
  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter(Boolean);
  }

  /** The element's tag name, lower case. */
  tag(): Promise<string> {
    return this.root.evaluate((el) => el.tagName.toLowerCase());
  }

  /** The element's accessibility subtree as Playwright's ARIA snapshot. */
  ariaTree(): Promise<string> {
    return this.root.ariaSnapshot();
  }

  /** The element's own text, which an icon button never has. */
  textContent(): Promise<string> {
    return this.root.evaluate((el) => el.textContent ?? '');
  }

  /** The rendered width and height in whole CSS pixels. */
  async size(): Promise<{ width: number; height: number }> {
    const box = await this.root.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** The edge: width in px, style and colour. */
  async border(): Promise<{ width: number; style: string; colour: string }> {
    const colour = await this.root.evaluate(colourOf, 'borderTopColor');
    return this.root.evaluate((el, c) => {
      const style = getComputedStyle(el);
      return { width: parseFloat(style.borderTopWidth), style: style.borderTopStyle, colour: c };
    }, colour);
  }

  /** The fill as rgb(r, g, b), or 'transparent'. */
  fill(): Promise<string> {
    return this.root.evaluate((el) => {
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return a === 0 ? 'transparent' : `rgb(${r}, ${g}, ${b})`;
    });
  }

  /** The glyph colour (the icon draws in currentColor) as rgb(r, g, b). */
  glyphColour(): Promise<string> {
    return this.root.evaluate(colourOf, 'color');
  }

  /** WCAG contrast of the glyph against the fill or surface behind it, or of the focus ring. */
  contrast(part: ColourPart): Promise<number> {
    return this.root.evaluate(contrastOf, part);
  }

  /** The focus outline the element shows now: width and offset in px, style and colour. */
  async focusRing(): Promise<{ width: number; offset: number; style: string; colour: string }> {
    const colour = await this.root.evaluate(colourOf, 'outlineColor');
    return this.root.evaluate((el, c) => {
      const style = getComputedStyle(el);
      return {
        width: parseFloat(style.outlineWidth),
        offset: parseFloat(style.outlineOffset),
        style: style.outlineStyle,
        colour: c,
      };
    }, colour);
  }

  opacity(): Promise<number> {
    return this.root.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  }

  /** True when the whole element lies inside the viewport. */
  isFullyInView(): Promise<boolean> {
    return this.root.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth && r.bottom <= window.innerHeight
      );
    });
  }

  async hover(): Promise<void> {
    await this.root.hover();
  }

  /** Holds the primary mouse button down on the element (the :active state); release with `release()`. */
  async pressDown(): Promise<void> {
    await this.root.hover();
    await this.root.page().mouse.down();
  }

  async release(): Promise<void> {
    await this.root.page().mouse.up();
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async focus(): Promise<void> {
    await this.root.focus();
  }

  async press(key: string): Promise<void> {
    await this.root.focus();
    await this.root.press(key);
  }
}
