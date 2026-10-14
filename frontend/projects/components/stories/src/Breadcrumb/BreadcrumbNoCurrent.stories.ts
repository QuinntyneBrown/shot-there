import type { StoryObj } from '@storybook/angular';

import type { BreadcrumbComponent } from '@shot-there/components';

export const NoCurrent: StoryObj<BreadcrumbComponent> = {
  render: () => ({
    props: { items: [{ label: 'Studios', link: '/studios' }] },
    template: `<st-breadcrumb [items]="items" [current]="false" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When the record cannot be opened, the trail keeps only the way back and `current` is false, so nothing is marked current.',
      },
    },
  },
};
