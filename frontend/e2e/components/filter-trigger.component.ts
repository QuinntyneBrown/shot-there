import { Locator, Page } from '@playwright/test';
import { colourOf, ColourPart, contrastOf } from './contrast';
import { IconComponent } from './icon.component';

/** A button[st-filter-trigger]: the DS .filter-trigger pill, found by its accessible name. */
export class FilterTriggerComponent {
  readonly root: Locator;
  readonly icon: IconComponent;
  /** The .filter-trigger__count bubble. */
  readonly count: Locator;
  /** The bubble's visible number, hidden from assistive technology. */
  readonly countNumber: Locator;
  /** The bubble's visually hidden words (", 2 active"). */
  readonly countWords: Locator;

  constructor(scope: Page | Locator, name: string | RegExp = /^Filters/) {
    this.root = scope.getByRole('button', { name, exact: typeof name === 'string' });
    this.icon = new IconComponent(this.root);
    this.count = this.root.locator('.filter-trigger__count');
    this.countNumber = this.count.locator('[aria-hidden="true"]');
    this.countWords = this.count.locator('.visually-hidden');
  }

  static nameWithCount(count: number): string {
    return `Filters, ${count} active`;
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '')
      .split(/\s+/)
      .filter((c) => c.startsWith('filter-trigger'));
  }

  tag(): Promise<string> {
    return this.root.evaluate((el) => el.tagName.toLowerCase());
  }

  async height(): Promise<number> {
    return Math.round((await this.root.boundingBox())?.height ?? 0);
  }

  /** The inset ink edge the DS draws while the trigger's dialog is open. */
  hasOpenEdge(): Promise<boolean> {
    return this.root.evaluate((el) => getComputedStyle(el).boxShadow !== 'none');
  }

  /** The edge colour as rgb(r, g, b). */
  edgeColour(): Promise<string> {
    return this.root.evaluate(colourOf, 'borderTopColor');
  }

  opacity(): Promise<number> {
    return this.root.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  }

  /** WCAG contrast of the label against the fill, or of the edge or focus ring against the ground. */
  contrast(part: ColourPart): Promise<number> {
    return this.root.evaluate(contrastOf, part);
  }

  /** WCAG contrast of the bubble's number against the bubble. */
  countContrast(): Promise<number> {
    return this.count.evaluate(contrastOf, 'text');
  }

  /** The focus outline the trigger shows now: width in px, style and colour. */
  async focusRing(): Promise<{ width: number; style: string; colour: string }> {
    const colour = await this.root.evaluate(colourOf, 'outlineColor');
    return this.root.evaluate((el, c) => {
      const style = getComputedStyle(el);
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle, colour: c };
    }, colour);
  }

  async hover(): Promise<void> {
    await this.root.hover();
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
