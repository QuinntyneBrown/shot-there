import type { StoryObj } from '@storybook/angular';

import type { BreadcrumbComponent } from '@shot-there/components';

export const Default: StoryObj<BreadcrumbComponent> = {
  args: {
    items: [{ label: 'Studios', link: '/studios' }, { label: 'The Junction Loft' }],
    label: 'Breadcrumb',
    current: true,
    loading: false,
    collapse: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <st-breadcrumb
        [items]="items"
        [label]="label"
        [current]="current"
        [loading]="loading"
        [collapse]="collapse"
      />
    `,
  }),
};
