import type { StoryObj } from '@storybook/angular';

import type { PageHeaderComponent } from '@shot-there/components';

export const Default: StoryObj<PageHeaderComponent> = {
  args: {
    title: 'Liberty Village Loft',
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: `<st-page-header [title]="title" [loading]="loading" />`,
  }),
};
