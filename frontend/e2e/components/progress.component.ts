import { Locator, Page } from '@playwright/test';

/** An st-progress: a .progress role=progressbar named by its aria-label. */
export class ProgressComponent {
  readonly root: Locator;

  constructor(scope: Page | Locator, label: string) {
    this.root = scope.getByRole('progressbar', { name: label, exact: true });
  }

  async classes(): Promise<string[]> {
    return ((await this.root.getAttribute('class')) ?? '').split(/\s+/).filter((c) => c.startsWith('progress'));
  }

  /** The fill width as a fraction of the track, in whole percent. */
  fillPercent(): Promise<number> {
    return this.root.evaluate((el) => {
      const bar = el.querySelector('.progress__bar') as HTMLElement;
      return Math.round((bar.getBoundingClientRect().width / el.getBoundingClientRect().width) * 100);
    });
  }

  /** The fill background colour. */
  fillColour(): Promise<string> {
    return this.root.evaluate((el) => getComputedStyle(el.querySelector('.progress__bar') as HTMLElement).backgroundColor);
  }
}
