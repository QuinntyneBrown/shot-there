import { expect, test } from '@playwright/test';
import { LinkComponent } from '../components/link.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Foundations: native links (ICD-002 §11.1, DS link)', () => {
  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    test(`a plain <a> takes the DS link colour and hairline underline, thickening on hover, in the ${theme} theme`, async ({
      page,
    }) => {
      // Given a plain <a href> in a sentence, styled only by the global stylesheet
      const harness = new HarnessPage(page);
      await harness.open('foundations/links', { theme });
      const link = new LinkComponent(page, 'corrections@shotthere.ca');
      // When it renders
      // Then it is --color-fg-link with a hairline underline 0.15em below the text (2.4px at 16px)
      expect(await link.look()).toEqual({
        colour: await harness.tokenColour('--color-fg-link'),
        underline: true,
        thickness: 1,
        offset: 2.4,
      });
      // When the pointer rests on it
      await link.hover();
      // Then it is --color-fg-link-hover with a thick underline
      expect(await link.look()).toEqual({
        colour: await harness.tokenColour('--color-fg-link-hover'),
        underline: true,
        thickness: 2,
        offset: 2.4,
      });
    });
  }
});
