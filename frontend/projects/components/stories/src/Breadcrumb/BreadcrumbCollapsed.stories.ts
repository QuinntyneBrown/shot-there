import type { StoryObj } from '@storybook/angular';

import type { BreadcrumbComponent } from '@shot-there/components';

export const Collapsed: StoryObj<BreadcrumbComponent> = {
  render: () => ({
    props: {
      items: [
        { label: 'Guides', link: '/guides' },
        { label: 'Best studios under $120 for 2 hours' },
      ],
    },
    template: `<st-breadcrumb [items]="items" collapse />`,
  }),
  globals: { viewport: { value: 'xs', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'With `collapse`, below 48rem only "‹ Guides" shows; from 48rem the full trail returns.',
      },
    },
  },
};
