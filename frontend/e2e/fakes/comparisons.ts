/** Comparison answers built from the mock catalogue (docs/mocks/pages/compare). */
type Light = 'none' | 'low' | 'medium' | 'strong';

export interface FakeComparedStudio {
  slug: string;
  name: string;
  allInCost2h: number;
  hourlyRate: number;
  minimumBookingHours: number;
  mandatoryFees: { name: string; amount: number }[];
  usableWidthM: number | null;
  usableDepthM: number | null;
  ceilingHeightM: number | null;
  naturalLight: { morning: Light; midday: Light; afternoon: Light; evening: Light } | null;
  hasCycWall: boolean | null;
  cycWallCondition: string | null;
  includedGear: string[];
  parking: string | null;
  loadIn: 'stairs' | 'elevator' | 'freightElevator' | null;
  loadInNote: string | null;
  rubricScores: {
    category: 'value' | 'light' | 'space' | 'gear' | 'logistics' | 'condition';
    score: number;
  }[];
  overallScore: number;
  priceLastVerified: string;
  priceStale: boolean;
  isLowestAllInCost: boolean;
  testShots: {
    id: string;
    alt: string;
    caption: string | null;
    variants: { width: number; url: string }[];
  }[];
}

export interface FakeComparison {
  studios: FakeComparedStudio[];
  notFoundSlugs: string[];
  truncated: boolean;
}

const scores = (
  value: number,
  light: number,
  space: number,
  gear: number,
  logistics: number,
  condition: number,
) =>
  (['value', 'light', 'space', 'gear', 'logistics', 'condition'] as const).map((category, i) => ({
    category,
    score: [value, light, space, gear, logistics, condition][i],
  }));

const shots = (slug: string, name: string) =>
  ['Headshot', 'Full length', 'Product on table'].map((caption, i) => ({
    id: `test-${slug}-${i + 1}`,
    alt: `${name}, test shot ${i + 1}, ${caption.toLowerCase()}.`,
    caption,
    variants: [{ width: 480, url: `/test-images/test-${slug}-${i + 1}-480.svg` }],
  }));

export const JUNCTION: FakeComparedStudio = {
  slug: 'the-junction-loft',
  name: 'The Junction Loft',
  allInCost2h: 145,
  hourlyRate: 60,
  minimumBookingHours: 2,
  mandatoryFees: [{ name: 'Cleaning', amount: 25 }],
  usableWidthM: 6.1,
  usableDepthM: 4.3,
  ceilingHeightM: 4.0,
  naturalLight: { morning: 'medium', midday: 'strong', afternoon: 'strong', evening: 'low' },
  hasCycWall: true,
  cycWallCondition: 'scuffed',
  includedGear: ['2 strobes', 'LED panel', 'octabox', '2 reflectors', '4 C-stands'],
  parking: 'Street, paid',
  loadIn: 'freightElevator',
  loadInNote: 'small',
  rubricScores: scores(4, 5, 3, 4, 2, 5),
  overallScore: 3.8,
  priceLastVerified: '2026-09-22',
  priceStale: false,
  isLowestAllInCost: false,
  testShots: shots('the-junction-loft', 'The Junction Loft'),
};

export const LESLIEVILLE: FakeComparedStudio = {
  ...JUNCTION,
  slug: 'leslieville-daylight-studio',
  name: 'Leslieville Daylight Studio',
  allInCost2h: 91,
  hourlyRate: 45.5,
  mandatoryFees: [],
  usableWidthM: 6.4,
  usableDepthM: 4.9,
  ceilingHeightM: 3.7,
  hasCycWall: false,
  cycWallCondition: null,
  parking: null,
  loadIn: 'stairs',
  loadInNote: null,
  rubricScores: scores(5, 5, 3, 3, 4, 4),
  overallScore: 4.0,
  priceLastVerified: '2026-08-10',
  isLowestAllInCost: true,
  testShots: shots('leslieville-daylight-studio', 'Leslieville Daylight Studio'),
};

export const OSSINGTON: FakeComparedStudio = {
  ...JUNCTION,
  slug: 'ossington-blackbox',
  name: 'Ossington Blackbox',
  allInCost2h: 270,
  hourlyRate: 90,
  minimumBookingHours: 3,
  mandatoryFees: [],
  rubricScores: scores(3, 2, 5, 5, 4, 4),
  overallScore: 3.8,
  priceLastVerified: '2026-03-02',
  priceStale: true,
  testShots: shots('ossington-blackbox', 'Ossington Blackbox'),
};

export const LIBERTY: FakeComparedStudio = {
  ...JUNCTION,
  slug: 'liberty-cyc-house',
  name: 'Liberty Cyc House',
  allInCost2h: 185,
  hourlyRate: 75,
  overallScore: 4.2,
  testShots: shots('liberty-cyc-house', 'Liberty Cyc House'),
};

export const comparisonOf = (
  studios: FakeComparedStudio[],
  extra: Partial<FakeComparison> = {},
): FakeComparison => ({
  studios,
  notFoundSlugs: [],
  truncated: false,
  ...extra,
});
