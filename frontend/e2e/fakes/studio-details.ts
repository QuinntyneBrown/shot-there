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
  }
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
  }
};
