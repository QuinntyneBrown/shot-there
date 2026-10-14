import { Locator, Page } from '@playwright/test';
import { colourOf, ColourPart, contrastOf } from './contrast';
import { IconComponent } from './icon.component';

/** A button[st-button] or a[st-button]: the DS .btn, found by role and accessible name. */
export class ButtonComponent {
  readonly root: Locator;
  readonly icon: IconComponent;

  constructor(scope: Page | Locator, name: string | RegExp, role: 'button' | 'link' = 'button') {
    this.root = scope.getByRole(role, { name, exact: true });
    this.icon = new IconComponent(this.root);
  }

  /** The DS .btn classes on the element, in order: the block first, then modifiers. */
  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('btn'));
  }

  /** True when the element carries the DS toggle class .compare-toggle. */
  async isToggle(): Promise<boolean> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).includes('compare-toggle');
  }

  /** The element's tag name, lower case: `button` or `a`. */
  tag(): Promise<string> {
    return this.root.evaluate((el) => el.tagName.toLowerCase());
  }

  /** The element's accessibility subtree as Playwright's ARIA snapshot (`- button "Close"`). */
  ariaTree(): Promise<string> {
    return this.root.ariaSnapshot();
  }

  /** The rendered width and height in whole CSS pixels. */
  async size(): Promise<{ width: number; height: number }> {
    const box = await this.root.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** True when the label fits the element without being cut off. */
  labelFits(): Promise<boolean> {
    return this.root.evaluate((el) => el.scrollWidth <= el.clientWidth);
  }

  /** True when the whole element lies inside the viewport once scrolled to. */
  async isFullyInView(): Promise<boolean> {
    await this.root.scrollIntoViewIfNeeded();
    return this.root.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth && r.bottom <= window.innerHeight;
    });
  }

  /** The focus outline the element shows now: width and offset in px, style, and colour. */
  focusRing(): Promise<{ width: number; offset: number; style: string; colour: string }> {
    return this.root.evaluate((el) => {
      const style = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.fillStyle = style.outlineColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return {
        width: parseFloat(style.outlineWidth),
        offset: parseFloat(style.outlineOffset),
        style: style.outlineStyle,
        colour: `rgb(${r}, ${g}, ${b})`,
      };
    });
  }

  /** The text colour; a busy button hides its label by making it transparent. */
  labelColour(): Promise<string> {
    return this.root.evaluate((el) => getComputedStyle(el).color);
  }

  /** True while the DS busy spinner turns over the label. */
  showsSpinner(): Promise<boolean> {
    return this.root.evaluate((el) => {
      const after = getComputedStyle(el, '::after');
      return after.content !== 'none' && after.animationName !== 'none';
    });
  }

  /** Computed fill, text and edge colours as `rgb(r, g, b)`. */
  async colours(): Promise<{ background: string; text: string; border: string }> {
    return {
      background: await this.root.evaluate(colourOf, 'backgroundColor'),
      text: await this.root.evaluate(colourOf, 'color'),
      border: await this.root.evaluate(colourOf, 'borderTopColor'),
    };
  }

  /** WCAG contrast of the label against the fill, or of the edge or focus ring against the ground around it. */
  contrast(part: ColourPart): Promise<number> {
    return this.root.evaluate(contrastOf, part);
  }

  /** The element's opacity: 0.5 is the DS disabled look. */
  opacity(): Promise<number> {
    return this.root.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  }

  /** Fires a click event on the element itself, as assistive technology does, bypassing pointer hit-testing. */
  async activate(): Promise<void> {
    await this.root.dispatchEvent('click');
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
