import { Locator, Page } from '@playwright/test';

/** Any st-* form control rendering the shared .field: found by its label text. */
export class FieldComponent {
  readonly input: Locator;

  constructor(
    private readonly page: Page,
    readonly label: string,
    role: 'textbox' | 'spinbutton' | 'combobox' | 'checkbox' = 'textbox',
  ) {
    this.input = page.getByRole(role, { name: label, exact: true });
  }

  /** The text of the visible message elements, in DOM order. */
  messages(): Promise<string[]> {
    return this.input
      .locator('xpath=ancestor::*[contains(@class,"field")][1]')
      .locator('.field__error, .field__warning, .field__help')
      .allInnerTexts();
  }

  /** The text of the elements named by aria-describedby, in order. */
  async description(): Promise<string[]> {
    return this.input.evaluate((el) =>
      (el.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? ''),
    );
  }

  /** The line the harness prints for the control value: "<prefix> value: <output>". */
  value(prefix: string): Locator {
    return this.page.locator('p', { hasText: prefix + ' value:' }).locator('output');
  }
}
