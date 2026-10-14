import { Locator, Page } from '@playwright/test';
import { colourOf, ColourPart, contrastOf } from './contrast';
import { IconComponent } from './icon.component';

/** An a[st-link] (or any native link): found by its accessible name. */
export class LinkComponent {
  readonly root: Locator;
  readonly icon: IconComponent;
  readonly hiddenSuffix: Locator;

  constructor(scope: Page | Locator, name: string) {
    this.root = scope.getByRole('link', { name, exact: true });
    this.icon = new IconComponent(this.root);
    this.hiddenSuffix = this.root.locator('.visually-hidden');
  }

  /** The DS link modifiers on the element (.link--standalone, .link--external). */
  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('link--'));
  }

  /** Every class on the element, if any. */
  async allClasses(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter(Boolean);
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

  /** WCAG contrast of the text against the ground behind the link, or of its focus ring. */
  contrast(part: ColourPart): Promise<number> {
    return this.root.evaluate(contrastOf, part);
  }

  /** The focus outline the link shows now: width in px, style and colour. */
  async focusRing(): Promise<{ width: number; style: string; colour: string }> {
    const colour = await this.root.evaluate(colourOf, 'outlineColor');
    return this.root.evaluate((el, c) => {
      const style = getComputedStyle(el);
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle, colour: c };
    }, colour);
  }

  /** True when the arrow comes straight after the link text, with nothing but the text before it. */
  arrowFollowsText(): Promise<boolean> {
    return this.root.evaluate((a) => {
      const svg = a.querySelector('svg.icon');
      if (!svg) return false;
      const before = document.createRange();
      before.setStart(a, 0);
      before.setEndBefore(svg);
      return before.toString().trim().length > 0 && !/\s$/.test(before.toString());
    });
  }

  /** True when the arrow sits on the same rendered line as the last word of the link text. */
  arrowOnLastWordLine(): Promise<boolean> {
    return this.root.evaluate((a) => {
      const svg = a.querySelector('svg.icon')!;
      const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      let last: Text | null = null;
      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (node.parentElement?.closest('.visually-hidden')) break;
        if (node.data.trim()) last = node;
      }
      if (!last) return false;
      const range = document.createRange();
      const end = last.data.trimEnd().length;
      range.setStart(last, end - 1);
      range.setEnd(last, end);
      const word = range.getBoundingClientRect();
      const arrow = svg.getBoundingClientRect();
      return arrow.top < word.bottom && arrow.bottom > word.top;
    });
  }

  /** True when the whole link lies inside the viewport once scrolled to. */
  async isFullyInView(): Promise<boolean> {
    await this.root.scrollIntoViewIfNeeded();
    return this.root.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth && r.bottom <= window.innerHeight;
    });
  }

  async hover(): Promise<void> {
    await this.root.hover();
  }

  async click(): Promise<void> {
    await this.root.click();
  }
}
