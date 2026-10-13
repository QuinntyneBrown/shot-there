import { givenStudio } from './fakes/fake-studios-api';
import { BLOORDALE_SUN_STUDIO, LESLIEVILLE_DAYLIGHT_STUDIO, THE_JUNCTION_LOFT } from './fakes/studio-details';
import { expect, test } from './fakes/test';
import { StudioPage } from './pages/studio.page';

test.describe('Studio page: verdict and disclosure', () => {
  test('shows who it suits, each rubric score out of 5 and the overall score', async ({ page }) => {
    // Given a studio scored Value 4, Light 5, Space 3, Gear 4, Logistics 2, Condition 5
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then each score reads "Category: n out of 5" and the overall is 3.8
    await expect(studio.rubricScores).toHaveText([
      'Value: 4 out of 5',
      'Light: 5 out of 5',
      'Space: 3 out of 5',
      'Gear: 4 out of 5',
      'Logistics: 2 out of 5',
      'Condition: 5 out of 5'
    ]);
    await expect(studio.overallScore).toHaveText('3.8 overall, out of 5');
    await expect(studio.verdictPart("Who it's for")).toHaveText('Portrait and fashion shooters who want big north light and a usable cyc on a mid-range budget.');
    await expect(studio.verdictPart('Who should skip it')).toContainText('Video crews');
  });

  test('shows a whole-number overall score with one decimal', async ({ page }) => {
    // Given a studio scored 3 in every category
    await givenStudio(page, BLOORDALE_SUN_STUDIO);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('bloordale-sun-studio');
    // Then the overall reads 3.0
    await expect(studio.overallScore).toHaveText('3.0 overall, out of 5');
  });

  test('discloses a session paid in full beside the verdict', async ({ page }) => {
    // Given a session the reviewer paid for in full
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then the verdict carries the disclosure
    await expect(studio.disclosure).toContainText('I paid the full rate for this session. No studio pays for placement or scores.');
  });

  test('discloses a comped session and says it did not affect the scores', async ({ page }) => {
    // Given a session the studio provided free of charge
    await givenStudio(page, BLOORDALE_SUN_STUDIO);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('bloordale-sun-studio');
    // Then the disclosure names the provider and says the scores were not affected
    await expect(studio.disclosure).toContainText('This session was provided free of charge by Bloordale Sun Studio. That did not affect the scores.');
  });

  test('discloses a discounted session and names the provider', async ({ page }) => {
    // Given a discounted session
    await givenStudio(page, LESLIEVILLE_DAYLIGHT_STUDIO);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('leslieville-daylight-studio');
    // Then the disclosure says it was discounted and by whom
    await expect(studio.disclosure).toContainText('This session was discounted by Leslieville Daylight Studio. That did not affect the scores.');
  });
});
