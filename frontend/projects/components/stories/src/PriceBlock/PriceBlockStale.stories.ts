import type { StoryObj } from '@storybook/angular';

import type { PriceBlockComponent } from '@shot-there/components';

export const Stale: StoryObj<PriceBlockComponent> = {
  render: () => ({
    props: {
      items: [
        { term: 'Hourly rate', detail: '$90.00', numeric: true },
        { term: 'Minimum booking', detail: '3 hours' },
        { term: 'Extra fees', detail: 'None' },
      ],
      verified: { datetime: '2026-03-03', text: '3 March 2026' },
    },
    template: `
      <st-price-block
        allIn="$270.00"
        allInText="All-in for a standard 2-hour shoot: the 3-hour minimum applies, so 3 hours at $90.00. No mandatory fees."
        [items]="items"
        verifiedLabel="Prices verified"
        [verified]="verified"
      >
        <st-alert tone="warning" role="status" title="Prices may be out of date">
          We last checked these prices 225 days ago. Confirm with the studio before you book.
        </st-alert>
      </st-price-block>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When the server marks prices stale, the application projects a warning `st-alert` after the verified line; every price stays visible.',
      },
    },
  },
};
