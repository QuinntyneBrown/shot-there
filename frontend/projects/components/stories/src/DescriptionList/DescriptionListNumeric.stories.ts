import type { StoryObj } from '@storybook/angular';

import type { DescriptionListComponent } from '@shot-there/components';

export const Numeric: StoryObj<DescriptionListComponent> = {
  render: () => ({
    props: {
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
    },
    template: `
      <section aria-labelledby="pricing" class="stack stack--sm">
        <h2 id="pricing">Pricing</h2>
        <st-description-list [items]="items" />
      </section>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`numeric` sets an amount in tabular figures; `badge` adds a qualifier such as "Mandatory" after the value.',
      },
    },
  },
};
