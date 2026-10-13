/** A complete outdoor spot save body as the editor sends it. */
export function aSpotInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'Riverdale Park East',
    neighbourhood: 'Riverdale',
    type: 'park',
    latitude: 43.6703,
    longitude: -79.3542,
    directions: 'Walk east from Broadview station.',
    lightByTime: [
      { timeOfDay: 'morning', rating: 'medium', note: null },
      { timeOfDay: 'goldenHour', rating: 'strong', note: 'Skyline glows' },
    ],
    lightBySeason: [{ season: 'autumn', note: 'Leaves turn in mid-October' }],
    weekdayCrowds: 'low',
    weekendCrowds: 'high',
    parking: 'Street parking on Broadview',
    washrooms: null,
    changing: null,
    permits: [
      { shootType: 'portrait', required: false },
      { shootType: 'commercial', required: true },
    ],
    permitSourceUrl: 'https://www.toronto.ca/permits',
    bestUses: ['portrait', 'engagement'],
    disclosure: 'paid_in_full',
    disclosureProvider: null,
    ...overrides,
  };
}
