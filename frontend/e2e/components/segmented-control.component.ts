import { Locator, Page } from '@playwright/test';

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

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('segmented'));
  }

  /** An option's rendered width and height in whole CSS pixels. */
  async optionSize(name: string): Promise<{ width: number; height: number }> {
    const box = await this.option(name).boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  async choose(name: string): Promise<void> {
    await this.option(name).click();
  }

  async press(name: string, key: string): Promise<void> {
    await this.option(name).focus();
    await this.option(name).press(key);
  }
}
