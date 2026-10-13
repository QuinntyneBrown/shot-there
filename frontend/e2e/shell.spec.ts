import { expect, test } from './fakes/test';
import { ShellPage } from './pages/shell.page';

test.describe('App shell', () => {
  test('declares the document language as Canadian English', async ({ page }) => {
    // Given the home page
    const shell = new ShellPage(page);
    // When it loads
    await shell.open();
    // Then the document language is en-CA
    expect(await shell.documentLanguage()).toBe('en-CA');
  });
});
