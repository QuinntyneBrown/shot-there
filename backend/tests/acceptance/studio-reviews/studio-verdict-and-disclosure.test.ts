import { describe, expect, it } from 'vitest';
import { aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getStudioPage } from '@/tests/support/get-studio-page';

describe('L2-011 verdict and rubric scores', () => {
  it('Given scores Value 4, Light 5, Space 3, Gear 4, Logistics 2, Condition 5, when returned, then each score is listed and the overall is 3.8', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          whoItsFor: 'Headshot photographers.',
          whoShouldSkip: 'Large crews.',
          scoreValue: 4,
          scoreLight: 5,
          scoreSpace: 3,
          scoreGear: 4,
          scoreLogistics: 2,
          scoreCondition: 5,
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.verdict).toEqual({
      whoItsFor: 'Headshot photographers.',
      whoShouldSkip: 'Large crews.',
      scores: { value: 4, light: 5, space: 3, gear: 4, logistics: 2, condition: 5 },
      overallScore: 3.8,
    });
  });

  it('Given a 3 in every category, when returned, then the overall is 3.0', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          scoreValue: 3,
          scoreLight: 3,
          scoreSpace: 3,
          scoreGear: 3,
          scoreLogistics: 3,
          scoreCondition: 3,
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.verdict.overallScore).toBe(3);
  });
});

describe('L2-012 studio disclosure', () => {
  it.each([
    { disclosure: 'paid_in_full' as const, disclosureProvider: null },
    { disclosure: 'comped' as const, disclosureProvider: 'The studio' },
    { disclosure: 'discounted' as const, disclosureProvider: 'Lumen Rentals' },
  ])('Given a $disclosure session, when returned, then the disclosure carries its kind and provider', async (values) => {
    useFakeDependencies({ studios: [aStudio({ slug: 's', ...values })] });

    const { body } = await getStudioPage('s');

    expect(body.disclosure).toEqual({ kind: values.disclosure, provider: values.disclosureProvider });
  });
});
