import { Locator, Page } from '@playwright/test';
import { colourOf, contrastOf } from './contrast';

/** An st-segmented: a .segmented group of toggle buttons, found by the group's label. */
export class SegmentedControlComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, label: string) {
    this.root = scope.getByRole('group', { name: label, exact: true });
  }

  option(name: string): Locator {
    return this.root.getByRole('button', { name, exact: true });
  }

  /** The names of the options that are aria-pressed="true". */
  pressedOptions(): Promise<string[]> {
    return this.root.getByRole('button', { pressed: true }).allInnerTexts();
  }

  /** Every option button's name, type and data-text, in order. */
  items(): Promise<{ name: string; type: string | null; dataText: string | null }[]> {
    return this.root.getByRole('button').evaluateAll((buttons) =>
      buttons.map((b) => ({ name: (b as HTMLElement).innerText.trim(), type: b.getAttribute('type'), dataText: b.getAttribute('data-text') })),
    );
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('segmented'));
  }

  /** An option's text colour as rgb(r, g, b) and font weight. */
  async optionLook(name: string): Promise<{ colour: string; weight: number }> {
    const option = this.option(name);
    return { colour: await option.evaluate(colourOf, 'color'), weight: await option.evaluate((el) => Number(getComputedStyle(el).fontWeight)) };
  }

  /** WCAG contrast of an option's text, or of its focus ring, against the ground behind it. */
  optionContrast(name: string, part: 'text' | 'outline'): Promise<number> {
    return this.option(name).evaluate(contrastOf, part);
  }

  /** An option's focus outline: width in px, style and colour. */
  async optionFocusRing(name: string): Promise<{ width: number; style: string; colour: string }> {
    const option = this.option(name);
    const colour = await option.evaluate(colourOf, 'outlineColor');
    return option.evaluate((el, c) => {
      const style = getComputedStyle(el);
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle, colour: c };
    }, colour);
  }

  /** An option's rendered width and height in whole CSS pixels. */
  async optionSize(name: string): Promise<{ width: number; height: number }> {
    const box = await this.option(name).boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** True when every option lies whole inside the viewport. */
  optionsInView(): Promise<boolean> {
    return this.root.getByRole('button').evaluateAll((buttons) =>
      buttons.every((b) => {
        const r = b.getBoundingClientRect();
        return r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth && r.bottom <= window.innerHeight;
      }),
    );
  }

  async choose(name: string): Promise<void> {
    await this.option(name).click();
  }

  async hover(name: string): Promise<void> {
    await this.option(name).hover();
  }

  async press(name: string, key: string): Promise<void> {
    await this.option(name).focus();
    await this.option(name).press(key);
  }
}
