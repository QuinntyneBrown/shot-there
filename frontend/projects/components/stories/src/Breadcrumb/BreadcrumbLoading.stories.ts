import type { StoryObj } from '@storybook/angular';

import type { BreadcrumbComponent } from '@shot-there/components';

export const Loading: StoryObj<BreadcrumbComponent> = {
  render: () => ({
    props: { items: [{ label: 'Studios', link: '/admin/studios' }, { label: 'Loading' }] },
    template: `<st-breadcrumb [items]="items" loading />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`loading` draws a skeleton for the current crumb while the record loads; its label stays as hidden text.',
      },
    },
  },
};
