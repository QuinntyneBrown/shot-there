import { Locator, Page } from '@playwright/test';

/** The compare bar the shell shows while studios are selected, and its limit toast. */
export class CompareBarPanel {
  readonly root: Locator;
  readonly count: Locator;
  readonly names: Locator;
  readonly hint: Locator;
  readonly compareButton: Locator;
  readonly clearButton: Locator;
  readonly limitToast: Locator;
  readonly limitAnnouncement: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByRole('complementary', { name: 'Studios to compare' });
    this.count = this.root.getByRole('status');
    this.names = this.root.locator('.compare-bar__names');
    this.hint = this.root.getByText('Pick at least 2 studios to compare');
    this.compareButton = this.root.getByRole('button', { name: 'Compare' });
    this.clearButton = this.root.getByRole('button', { name: 'Clear' });
    this.limitToast = page.locator('.toast').filter({ hasText: 'You can compare up to 4 studios' });
    this.limitAnnouncement = page
      .getByRole('status')
      .filter({ hasText: 'You can compare up to 4 studios' });
  }

  /** Whether the bar sits on the bottom edge of the viewport. */
  async isPinnedToBottom(): Promise<boolean> {
    const box = await this.root.boundingBox();
    const viewport = this.page.viewportSize();
    return !!box && !!viewport && Math.abs(box.y + box.height - viewport.height) < 1;
  }

  /** With the page scrolled to the end, whether the last of the page content sits clear of the bar. */
  async leavesPageEndUncovered(): Promise<boolean> {
    await this.page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
    );
    const bar = await this.root.boundingBox();
    const lastLine = await this.page.getByRole('contentinfo').locator('p').last().boundingBox();
    return !!bar && !!lastLine && lastLine.y + lastLine.height <= bar.y;
  }
}
