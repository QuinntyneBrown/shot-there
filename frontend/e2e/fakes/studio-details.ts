/** Studio review pages from the mock catalogue (docs/mocks/README.md and docs/mocks/pages/studio). */
export interface FakeStudioDetail {
  slug: string;
  basics: { name: string; neighbourhood: string; addressOrCrossStreets: string; bookingUrl: string };
  pricing: {
    hourlyRate: number;
    minBookingHours: number;
    fees: { name: string; amount: number; mandatory: boolean }[];
    allInCost2h: number;
    priceVerifiedAt: string;
    priceStale: boolean;
  };
  specifications: {
    usableWidthM: number;
    usableDepthM: number;
    ceilingHeightM: number;
    windowDirection: string;
    naturalLight: Record<'morning' | 'midday' | 'afternoon' | 'evening', 'none' | 'low' | 'medium' | 'strong'>;
    outletCount: number;
    outletType: string;
    has20ACircuits: boolean;
    hasCycWall: boolean;
    cycWallCondition: string | null;
    backdrops: string[];
  };
  gear: { included: FakeGearItem[]; extras: FakeGearItem[] };
  logistics: {
    loadIn: 'stairs' | 'elevator' | 'freightElevator';
    loadInNote: string | null;
    parking: string;
    transit: string;
    washroom: string;
    changingArea: string | null;
    clientSeating: string;
    noise: string;
  };
  verdict: {
    whoItsFor: string;
    whoShouldSkip: string;
    scores: Record<'value' | 'light' | 'space' | 'gear' | 'logistics' | 'condition', number>;
    overallScore: number;
  };
  disclosure: { kind: 'paidFull' | 'discounted' | 'comped'; provider: string | null };
  testShots: FakeImage[];
  gallery: FakeImage[];
}

interface FakeImage {
  id: string;
  alt: string;
  caption: string | null;
  variants: { width: number; url: string }[];
}

const image = (id: string, alt: string, caption: string | null = null): FakeImage => ({
  id,
  alt,
  caption,
  variants: [
    { width: 480, url: `/test-images/${id}-480.svg` },
    { width: 1200, url: `/test-images/${id}-1200.svg` }
  ]
});

interface FakeGearItem {
  name: string;
  category: 'lights' | 'modifiers' | 'stands' | 'other';
  quantity: number | null;
  extraCost: number | null;
}

export const THE_JUNCTION_LOFT: FakeStudioDetail = {
  slug: 'the-junction-loft',
  basics: {
    name: 'The Junction Loft',
    neighbourhood: 'Junction',
    addressOrCrossStreets: 'Dundas St W at Pacific Ave, 2nd floor',
    bookingUrl: 'https://thejunctionloft.example/book'
  },
  pricing: {
    hourlyRate: 60,
    minBookingHours: 2,
    fees: [
      { name: 'Cleaning fee', amount: 25, mandatory: true },
      { name: 'After-hours access', amount: 30, mandatory: false }
    ],
    allInCost2h: 145,
    priceVerifiedAt: '2026-09-22',
    priceStale: false
  },
  specifications: {
    usableWidthM: 6.1,
    usableDepthM: 4.3,
    ceilingHeightM: 4.0,
    windowDirection: 'North',
    naturalLight: { morning: 'medium', midday: 'strong', afternoon: 'strong', evening: 'low' },
    outletCount: 8,
    outletType: 'standard 15 A',
    has20ACircuits: true,
    hasCycWall: true,
    cycWallCondition: 'scuffed',
    backdrops: ['White, grey and black seamless, 2.7 m']
  },
  gear: {
    included: [
      { name: 'Godox AD600 strobe', category: 'lights', quantity: 2, extraCost: null },
      { name: '60 cm LED panel', category: 'lights', quantity: 1, extraCost: null },
      { name: '120 cm octabox', category: 'modifiers', quantity: 1, extraCost: null },
      { name: '5-in-1 reflector', category: 'modifiers', quantity: 2, extraCost: null },
      { name: 'C-stand', category: 'stands', quantity: 4, extraCost: null },
      { name: 'Garment steamer', category: 'other', quantity: null, extraCost: null }
    ],
    extras: [
      { name: 'Hazer', category: 'other', quantity: null, extraCost: 20 },
      { name: 'Extra seamless roll', category: 'other', quantity: null, extraCost: 15 }
    ]
  },
  logistics: {
    loadIn: 'freightElevator',
    loadInNote: 'small, 1.2 m wide',
    parking: 'Street, paid, 2-hour limit on Dundas',
    transit: 'Dundas West station, 8-minute walk · 505 streetcar at the door',
    washroom: 'Private, in the studio',
    changingArea: 'Curtained corner with a mirror',
    clientSeating: 'Sofa for 4',
    noise: 'Streetcar rumble every few minutes; fine for stills, plan around it for video'
  },
  verdict: {
    whoItsFor: 'Portrait and fashion shooters who want big north light and a usable cyc on a mid-range budget.',
    whoShouldSkip: 'Video crews, because of the streetcar, and anyone hauling heavy cases: the freight elevator is tiny.',
    scores: { value: 4, light: 5, space: 3, gear: 4, logistics: 2, condition: 5 },
    overallScore: 3.8
  },
  disclosure: { kind: 'paidFull', provider: null },
  testShots: [
    image('test-the-junction-loft-1', 'Test shot 1, headshot: even falloff from the octabox, grey seamless, soft shadow under the chin.', 'Headshot'),
    image('test-the-junction-loft-2', 'Test shot 2, full length on the cyc: the scuffs show as faint marks behind the feet.', 'Full length'),
    image('test-the-junction-loft-3', 'Test shot 3, product on a table: clean highlight on the bottle, neutral background.', 'Product on table')
  ],
  gallery: [
    image('gallery-1', 'Portrait in window light, subject turned three-quarters toward the north windows.'),
    image('gallery-2', 'Close portrait against the brick wall with the octabox as fill.'),
    image('gallery-3', 'Full-length fashion frame on the cyc, warm afternoon light from the left.'),
    image('gallery-4', 'Low-key portrait with a black seamless and a single strobe.'),
    image('gallery-5', 'Seated portrait on the studio sofa, window light only.'),
    image('gallery-6', 'Standing portrait by the freight door, mixed daylight and LED.'),
    image('gallery-7', 'Headshot on grey seamless with a reflector under the chin.'),
    image('gallery-8', 'Wide frame of the whole space showing the cyc, the windows and the light stands.')
  ]
};

export const OSSINGTON_BLACKBOX: FakeStudioDetail = {
  slug: 'ossington-blackbox',
  basics: {
    name: 'Ossington Blackbox',
    neighbourhood: 'Ossington',
    addressOrCrossStreets: 'Ossington Ave at Dundas St W',
    bookingUrl: 'https://ossingtonblackbox.example/book'
  },
  pricing: {
    hourlyRate: 90,
    minBookingHours: 3,
    fees: [],
    allInCost2h: 270,
    priceVerifiedAt: '2026-03-02',
    priceStale: true
  },
  specifications: { ...THE_JUNCTION_LOFT.specifications },
  gear: THE_JUNCTION_LOFT.gear,
  logistics: THE_JUNCTION_LOFT.logistics,
  verdict: {
    whoItsFor: 'Large crews and video shoots that need space and full blackout.',
    whoShouldSkip: 'Anyone who wants daylight, or a quick one-hour session.',
    scores: { value: 3, light: 2, space: 5, gear: 5, logistics: 4, condition: 4 },
    overallScore: 3.8
  },
  disclosure: { kind: 'paidFull', provider: null },
  testShots: THE_JUNCTION_LOFT.testShots,
  gallery: THE_JUNCTION_LOFT.gallery
};

/** The "minimal" studio: no cyc wall, no paid extras, no changing area. */
export const BLOORDALE_SUN_STUDIO: FakeStudioDetail = {
  slug: 'bloordale-sun-studio',
  basics: {
    name: 'Bloordale Sun Studio',
    neighbourhood: 'Bloordale',
    addressOrCrossStreets: 'Bloor St W at Brock Ave',
    bookingUrl: 'https://bloordalesun.example/book'
  },
  pricing: {
    hourlyRate: 55,
    minBookingHours: 2,
    fees: [{ name: 'Cleaning fee', amount: 20, mandatory: true }],
    allInCost2h: 130,
    priceVerifiedAt: '2026-07-15',
    priceStale: false
  },
  specifications: {
    usableWidthM: 7.0,
    usableDepthM: 5.2,
    ceilingHeightM: 3.4,
    windowDirection: 'South',
    naturalLight: { morning: 'medium', midday: 'strong', afternoon: 'strong', evening: 'medium' },
    outletCount: 10,
    outletType: 'standard 15 A',
    has20ACircuits: false,
    hasCycWall: false,
    cycWallCondition: null,
    backdrops: ['White and grey seamless, 2.7 m']
  },
  gear: {
    included: [
      { name: 'Godox SL150 LED', category: 'lights', quantity: 2, extraCost: null },
      { name: 'Light stand', category: 'stands', quantity: 4, extraCost: null }
    ],
    extras: []
  },
  logistics: {
    loadIn: 'stairs',
    loadInNote: 'one flight, 14 steps',
    parking: 'Street, paid',
    transit: 'Lansdowne station, 6-minute walk · 505 streetcar at Brock Ave',
    washroom: 'Shared, down the hall',
    changingArea: null,
    clientSeating: '2 chairs',
    noise: 'Quiet on weekdays; the café below gets busy on weekend mornings'
  },
  verdict: {
    whoItsFor: 'Natural-light portraits on a budget.',
    whoShouldSkip: 'Anyone who needs a cyc wall.',
    scores: { value: 3, light: 3, space: 3, gear: 3, logistics: 3, condition: 3 },
    overallScore: 3.0
  },
  disclosure: { kind: 'comped', provider: 'Bloordale Sun Studio' },
  testShots: [
    image('test-bloordale-sun-studio-1', 'Test shot 1, headshot: soft south light, white seamless.', 'Headshot'),
    image('test-bloordale-sun-studio-2', 'Test shot 2, full length on white seamless; no cyc, so the floor line shows.', 'Full length'),
    image('test-bloordale-sun-studio-3', 'Test shot 3, product on a table by the window.', 'Product on table')
  ],
  gallery: [
    image('bloordale-gallery-1', 'Portrait by the south window at midday.'),
    image('bloordale-gallery-2', 'Seated portrait against grey seamless.')
  ]
};

/** A discounted session, otherwise like The Junction Loft. */
export const LESLIEVILLE_DAYLIGHT_STUDIO: FakeStudioDetail = {
  ...THE_JUNCTION_LOFT,
  slug: 'leslieville-daylight-studio',
  basics: { ...THE_JUNCTION_LOFT.basics, name: 'Leslieville Daylight Studio', neighbourhood: 'Leslieville' },
  disclosure: { kind: 'discounted', provider: 'Leslieville Daylight Studio' }
};
