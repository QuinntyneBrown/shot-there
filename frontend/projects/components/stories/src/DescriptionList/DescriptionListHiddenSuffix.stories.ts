import type { StoryObj } from '@storybook/angular';

import type { DescriptionListComponent } from '@shot-there/components';

export const HiddenSuffix: StoryObj<DescriptionListComponent> = {
  render: () => ({
    props: {
      items: [
        { term: 'Light', detail: '5', srSuffix: ' out of 5' },
        { term: 'Space', detail: '3', srSuffix: ' out of 5' },
        { term: 'Parking', detail: 'None nearby' },
      ],
    },
    template: `<st-description-list [items]="items" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`srSuffix` is visually hidden text after the value, so "5" is read as "5 out of 5".',
      },
    },
  },
};
