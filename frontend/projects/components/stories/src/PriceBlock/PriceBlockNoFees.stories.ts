import type { StoryObj } from '@storybook/angular';

import type { PriceBlockComponent } from '@shot-there/components';

export const NoFees: StoryObj<PriceBlockComponent> = {
  render: () => ({
    props: {
      items: [
        { term: 'Hourly rate', detail: '$40.00', numeric: true },
        { term: 'Minimum booking', detail: '1 hour' },
        { term: 'Extra fees', detail: 'None' },
      ],
      verified: { datetime: '2026-08-30', text: '30 August 2026' },
    },
    template: `
      <st-price-block
        allIn="$80.00"
        allInText="All-in for a standard 2-hour shoot: 2 hours at $40.00. No mandatory fees."
        [items]="items"
        verifiedLabel="Prices verified"
        [verified]="verified"
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Kensington Window Room has no fees: the working says so and the fees row reads "None" with no badge.',
      },
    },
  },
};
