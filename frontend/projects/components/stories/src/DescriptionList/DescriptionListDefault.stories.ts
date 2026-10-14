import type { StoryObj } from '@storybook/angular';

import type { DescriptionListComponent } from '@shot-there/components';

export const Default: StoryObj<DescriptionListComponent> = {
  args: {
    items: [
      { term: 'Usable shooting space', detail: '7.0 m × 5.2 m (23 ft × 17 ft)' },
      { term: 'Ceiling height', detail: '3.4 m (11 ft)' },
      { term: 'Window direction', detail: 'North' },
      { term: 'Cyc wall', detail: 'No' },
      { term: 'Power', detail: '6 outlets on 2 circuits, 15 A each' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <section aria-labelledby="specs" class="stack stack--sm">
        <h2 id="specs">Measured specifications</h2>
        <st-description-list [items]="items" />
      </section>
    `,
  }),
};
