import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/studios/[slug]/route';
import { aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

const TODAY = '2026-10-13';

async function getStudioPage(slug: string) {
  const response = await GET(new Request(`http://localhost/api/studios/${slug}`), {
    params: Promise.resolve({ slug }),
  });
  return { status: response.status, body: response.status === 200 ? await response.json() : null };
}

describe('L2-001 only published studios are reachable', () => {
  it('Given a studio in draft status, when its page is requested, then the API responds 404', async () => {
    useFakeDependencies({ today: TODAY, studios: [aStudio({ slug: 'draft-loft', status: 'draft' })] });

    const { status } = await getStudioPage('draft-loft');

    expect(status).toBe(404);
  });

  it('Given no studio has the slug, when its page is requested, then the API responds 404', async () => {
    useFakeDependencies({ today: TODAY, studios: [] });

    expect((await getStudioPage('nowhere')).status).toBe(404);
  });
});

describe('L2-003 studio basics', () => {
  it('Given a published studio, when its page is requested, then the basics carry name, neighbourhood, address and booking link', async () => {
    useFakeDependencies({
      today: TODAY,
      studios: [
        aStudio({
          slug: 'the-junction-loft',
          name: 'The Junction Loft',
          neighbourhood: 'The Junction',
          addressOrCrossStreets: 'Dundas St W & Keele St',
          bookingUrl: 'https://junctionloft.example/book',
        }),
      ],
    });

    const { status, body } = await getStudioPage('the-junction-loft');

    expect(status).toBe(200);
    expect(body.slug).toBe('the-junction-loft');
    expect(body.basics).toEqual({
      name: 'The Junction Loft',
      neighbourhood: 'The Junction',
      addressOrCrossStreets: 'Dundas St W & Keele St',
      bookingUrl: 'https://junctionloft.example/book',
    });
  });
});

describe('L2-004 studio pricing and all-in cost', () => {
  it.each([
    { hourlyRate: 60, minBookingHours: 1, fees: [], expected: 120 },
    { hourlyRate: 60, minBookingHours: 3, fees: [], expected: 180 },
    {
      hourlyRate: 60,
      minBookingHours: 2,
      fees: [
        { name: 'Cleaning', amount: 25, mandatory: true },
        { name: 'Strobe rental', amount: 40, mandatory: false },
      ],
      expected: 145,
    },
    { hourlyRate: 45.5, minBookingHours: 2, fees: [], expected: 91 },
  ])(
    'Given $hourlyRate/h with a $minBookingHours h minimum, when returned, then allInCost2h is $expected',
    async ({ hourlyRate, minBookingHours, fees, expected }) => {
      useFakeDependencies({ today: TODAY, studios: [aStudio({ slug: 's', hourlyRate, minBookingHours, fees })] });

      const { body } = await getStudioPage('s');

      expect(body.pricing.allInCost2h).toBe(expected);
    },
  );

  it('Given mandatory and optional fees, when returned, then each fee is listed with whether it is mandatory', async () => {
    const fees = [
      { name: 'Cleaning', amount: 25, mandatory: true },
      { name: 'Strobe rental', amount: 40, mandatory: false },
    ];
    useFakeDependencies({ today: TODAY, studios: [aStudio({ slug: 's', hourlyRate: 60, minBookingHours: 2, fees })] });

    const { body } = await getStudioPage('s');

    expect(body.pricing).toMatchObject({ hourlyRate: 60, minBookingHours: 2, fees });
  });
});

describe('L2-005 and L2-043 price last-verified date and staleness', () => {
  it.each([
    { verifiedAt: '2026-09-13', label: '30 days ago', stale: false },
    { verifiedAt: '2026-03-27', label: '200 days ago', stale: true },
    { verifiedAt: '2026-04-13', label: '183 days ago', stale: false },
    { verifiedAt: '2026-04-12', label: '184 days ago', stale: true },
  ])('Given pricing verified $label, when returned, then priceStale is $stale', async ({ verifiedAt, stale }) => {
    useFakeDependencies({ today: TODAY, studios: [aStudio({ slug: 's', priceVerifiedAt: verifiedAt })] });

    const { body } = await getStudioPage('s');

    expect(body.pricing.priceVerifiedAt).toBe(verifiedAt);
    expect(body.pricing.priceStale).toBe(stale);
  });
});
