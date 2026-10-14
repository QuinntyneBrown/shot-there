import { expect, test } from '@playwright/test';
import { TagListComponent } from '../components/tag-list.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('TagListComponent (ICD-002 §9.5)', () => {
  test('renders a named .tags list of static .tag items', async ({ page }) => {
    // Given a tag list labelled "Best uses" with three static items
    const harness = new HarnessPage(page);
    await harness.open('tag-list/states');
    // Then it is a list named "Best uses" of three .tag items and no links
    const list = new TagListComponent(page, 'Best uses');
    expect(await list.rootClasses()).toContain('tags');
    expect(await list.tags()).toEqual(['Engagement', 'Family', 'Portrait']);
    expect(await list.links()).toEqual([]);
    expect(harness.errors).toEqual([]);
  });

  test('renders an item with a link as an a.tag to its path, named by the section heading', async ({
    page,
  }) => {
    // Given a tag list of two links under the heading "Featured in"
    const harness = new HarnessPage(page);
    await harness.open('tag-list/states');
    // Then each is a link tag to its path
    const list = new TagListComponent(harness.page.getByRole('region', { name: 'Featured in' }));
    expect(await list.tags()).toEqual([
      'Best studios under $120 for 2 hours',
      'Best natural light',
    ]);
    expect(await list.links()).toEqual([
      { text: 'Best studios under $120 for 2 hours', href: '/guides/best-studios-under-120' },
      { text: 'Best natural light', href: '/guides/best-natural-light' },
    ]);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('tag-list/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
