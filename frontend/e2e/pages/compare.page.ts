import { Locator, Page } from '@playwright/test';

export class ComparePage {
  readonly heading: Locator;
  readonly table: Locator;
  readonly tableScroller: Locator;
  readonly notice: Locator;
  readonly needTwo: Locator;
  readonly browseStudiosLink: Locator;
  readonly copyLinkButton: Locator;
  readonly announcer: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.table = page.getByRole('table');
    this.tableScroller = page.getByRole('region', { name: /^Comparison of/ });
    this.notice = page.getByRole('main').getByRole('status');
    this.needTwo = page.getByRole('heading', { name: 'Pick at least two studios to compare' });
    this.browseStudiosLink = page.getByRole('main').getByRole('link', { name: 'Browse studios' });
    this.copyLinkButton = page.getByRole('button', { name: 'Copy link' });
    this.announcer = page.locator('.cdk-live-announcer-element');
  }

  async open(query: string): Promise<void> {
    await this.page.goto(`/compare${query}`);
  }

  async useWidth(width: number): Promise<void> {
    await this.page.setViewportSize({ width, height: 900 });
  }

  async allowClipboard(): Promise<void> {
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  }

  clipboardText(): Promise<string> {
    return this.page.evaluate(() => navigator.clipboard.readText());
  }

  currentUrl(): string {
    return this.page.url();
  }

  title(): Promise<string> {
    return this.page.title();
  }

  columnHeaders(): Promise<string[]> {
    return this.table.getByRole('columnheader').allInnerTexts();
  }

  /** The cells of the row whose header is `label`, one per studio. */
  rowCells(label: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('rowheader', { name: label, exact: true }) }).getByRole('cell');
  }

  rowHeader(label: string): Locator {
    return this.table.getByRole('rowheader', { name: label, exact: true });
  }

  hasPageHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  }

  tableScrollsSideways(): Promise<boolean> {
    return this.tableScroller.evaluate((el) => el.scrollWidth > el.clientWidth);
  }

  async scrollTableToEnd(): Promise<void> {
    await this.tableScroller.evaluate((el) => (el.scrollLeft = el.scrollWidth));
  }

  /** Narrowest studio column, in CSS pixels. */
  async narrowestStudioColumn(): Promise<number> {
    const widths = await this.table.getByRole('columnheader').evaluateAll((cells) => cells.map((c) => c.getBoundingClientRect().width));
    return Math.min(...widths);
  }
}
