import type { StoryObj } from '@storybook/angular';

import type { PriceBlockComponent } from '@shot-there/components';

export const Default: StoryObj<PriceBlockComponent> = {
  args: {
    allIn: '$145.00',
    allInText:
      'All-in for a standard 2-hour shoot: 2 hours at $60.00 plus the mandatory cleaning fee.',
    items: [
      { term: 'Hourly rate', detail: '$60.00', numeric: true },
      { term: 'Minimum booking', detail: '2 hours' },
      { term: 'Cleaning fee', detail: '$25.00', numeric: true, badge: 'Mandatory' },
      {
        term: 'After-hours access',
        detail: '$30.00',
        numeric: true,
        badge: 'Optional, not in all-in',
      },
    ],
    verifiedLabel: 'Prices verified',
    verified: { datetime: '2026-09-22', text: '22 September 2026' },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-price-block
        [allIn]="allIn"
        [allInText]="allInText"
        [items]="items"
        [verifiedLabel]="verifiedLabel"
        [verified]="verified"
      />
    `,
  }),
};
