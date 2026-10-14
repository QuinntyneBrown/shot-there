import { Locator, Page } from '@playwright/test';

export class EditorialPolicyPage {
  readonly heading: Locator;
  readonly policy: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.policy = page.getByRole('main');
  }

  async open(): Promise<void> {
    await this.page.goto('/editorial-policy');
  }

  rule(name: string): Locator {
    return this.policy.getByRole('heading', { level: 2, name });
  }

  title(): Promise<string> {
    return this.page.title();
  }
}
