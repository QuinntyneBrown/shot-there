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

  test('offers a skip link that moves focus to the main content', async ({ page }) => {
    // Given the home page
    const shell = new ShellPage(page);
    await shell.open();
    // When the visitor presses Tab once
    await shell.pressTab();
    // Then the skip link is focused
    await expect(shell.skipLink).toBeFocused();
    // When they activate it
    await shell.activateFocused();
    // Then focus is on the main landmark
    await expect(shell.main).toBeFocused();
  });
});
