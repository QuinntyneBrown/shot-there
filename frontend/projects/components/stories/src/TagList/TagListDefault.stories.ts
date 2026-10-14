import type { StoryObj } from '@storybook/angular';

import type { TagListComponent } from '@shot-there/components';

export const Default: StoryObj<TagListComponent> = {
  args: {
    label: 'Best uses',
    items: [
      { label: 'Engagement' },
      { label: 'Family' },
      { label: 'Portrait' },
      { label: 'Brand' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<st-tag-list [label]="label" [items]="items" />`,
  }),
};
