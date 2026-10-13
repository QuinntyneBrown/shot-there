/** The seven published studios of the mock catalogue (docs/mocks/README.md), most recent review first. */
export interface FakeStudioSummary {
  slug: string;
  name: string;
  neighbourhood: string;
  allInCost2h: number;
  overallScore: number;
  priceStale: boolean;
  reviewedAt: string;
  thumbnail: { url: string; width: number; height: number };
}

const studio = (slug: string, name: string, neighbourhood: string, allInCost2h: number, overallScore: number, reviewedAt: string, priceStale = false): FakeStudioSummary => ({
  slug,
  name,
  neighbourhood,
  allInCost2h,
  overallScore,
  priceStale,
  reviewedAt,
  thumbnail: { url: `/test-images/studio-${slug}.svg`, width: 1200, height: 800 }
});

export const PUBLISHED_STUDIOS: FakeStudioSummary[] = [
  studio('kensington-window-room', 'Kensington Window Room', 'Kensington Market', 80, 3.2, '2026-10-03'),
  studio('the-junction-loft', 'The Junction Loft', 'Junction', 145, 3.8, '2026-09-29'),
  studio('leslieville-daylight-studio', 'Leslieville Daylight Studio', 'Leslieville', 91, 4.0, '2026-08-14'),
  studio('bloordale-sun-studio', 'Bloordale Sun Studio', 'Bloordale', 130, 4.0, '2026-07-20'),
  studio('riverside-rooftop-studio', 'Riverside Rooftop Studio', 'Riverside', 100, 3.5, '2026-06-09'),
  studio('liberty-cyc-house', 'Liberty Cyc House', 'Liberty Village', 185, 4.2, '2026-05-02'),
  studio('ossington-blackbox', 'Ossington Blackbox', 'Ossington', 270, 3.8, '2026-03-06', true)
];
