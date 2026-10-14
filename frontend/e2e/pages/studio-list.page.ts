import { Locator, Page } from '@playwright/test';

import { StudioFiltersPanel } from './studio-filters.panel';

export class StudioListPage {
  readonly heading: Locator;
  readonly resultCount: Locator;
  readonly cards: Locator;
  readonly emptyState: Locator;
  readonly results: Locator;
  readonly loadingStatus: Locator;
  readonly skeletonCards: Locator;
  readonly errorAlert: Locator;
  readonly tryAgainButton: Locator;
  readonly sortControl: Locator;
  readonly announcer: Locator;
  readonly filtersSidebar: StudioFiltersPanel;
  readonly applyFiltersButton: Locator;
  readonly noMatches: Locator;
  readonly clearFiltersButton: Locator;
  readonly filtersButton: Locator;
  readonly filtersDialog: Locator;
  readonly dialogFilters: StudioFiltersPanel;
  readonly dialogShowButton: Locator;
  readonly dialogClearAllButton: Locator;
  readonly dialogCostError: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.resultCount = page.getByRole('status').filter({ hasText: /studio/ });
    this.cards = page.getByRole('list', { name: 'Studios' }).getByRole('listitem');
    this.emptyState = page.getByRole('heading', { name: 'No studio reviews yet' });
    this.results = page.getByRole('region', { name: 'Results' });
    this.loadingStatus = page.getByRole('status').filter({ hasText: 'Loading studios…' });
    this.skeletonCards = page.locator('.location-card--skeleton');
    this.errorAlert = page.getByRole('alert').filter({ hasText: "We couldn't load the studios" });
    this.tryAgainButton = page.getByRole('button', { name: 'Try again' });
    this.sortControl = page.getByRole('combobox', { name: 'Sort by' });
    this.announcer = page.locator('.cdk-live-announcer-element');
    this.filtersSidebar = new StudioFiltersPanel(
      page.getByRole('complementary', { name: 'Filter studios' }),
    );
    this.applyFiltersButton = this.filtersSidebar.root.getByRole('button', {
      name: 'Apply filters',
    });
    this.noMatches = page.getByRole('heading', { name: 'No studios match these filters' });
    this.clearFiltersButton = page.getByRole('main').getByRole('button', { name: 'Clear filters' });
    // The open dialog is modal, so the page behind it (and this button) leaves the accessibility tree.
    this.filtersButton = page
      .getByRole('main', { includeHidden: true })
      .getByRole('button', { name: /^Filters/, includeHidden: true });
    this.filtersDialog = page.getByRole('dialog', { name: 'Filters' });
    this.dialogFilters = new StudioFiltersPanel(this.filtersDialog);
    this.dialogShowButton = this.filtersDialog.getByRole('button', { name: /^Show/ });
    this.dialogClearAllButton = this.filtersDialog.getByRole('button', { name: 'Clear all' });
    this.dialogCostError = this.filtersDialog.getByText(
      'The minimum must be lower than the maximum',
    );
  }

  async useDesktopWidth(): Promise<void> {
    await this.page.setViewportSize({ width: 1280, height: 900 });
  }

  async usePhoneWidth(): Promise<void> {
    await this.page.setViewportSize({ width: 320, height: 700 });
  }

  async open(query = ''): Promise<void> {
    await this.page.goto(`/studios${query}`);
  }

  async sortBy(label: string): Promise<void> {
    await this.sortControl.selectOption({ label });
  }

  async selectedSort(): Promise<string> {
    return this.sortControl.locator('option:checked').innerText();
  }

  async openFiltersDialog(): Promise<void> {
    await this.filtersButton.click();
  }

  async closeDialogWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  currentQuery(): URLSearchParams {
    return new URL(this.page.url()).searchParams;
  }

  compareToggle(name: string): Locator {
    return this.page
      .getByRole('main')
      .getByRole('button', { name: new RegExp(`^(Compare|Remove) ${name}$`) });
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  currentPath(): string {
    const url = new URL(this.page.url());
    return `${url.pathname}${url.search}`;
  }

  async cardNames(): Promise<string[]> {
    return this.cards.getByRole('heading').allInnerTexts();
  }

  card(name: string): Locator {
    return this.cards.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  cardLink(name: string): Locator {
    return this.card(name).getByRole('link', { name, exact: true });
  }
}
