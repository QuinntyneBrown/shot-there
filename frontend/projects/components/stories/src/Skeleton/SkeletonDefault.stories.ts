import type { StoryObj } from '@storybook/angular';

import type { SkeletonComponent } from '@shot-there/components';

export const Default: StoryObj<SkeletonComponent> = {
  args: {
    shape: 'text',
  },
  argTypes: {
    shape: { control: 'select', options: ['text', 'title', 'rect', 'pill', 'circle'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-skeleton
        [shape]="shape"
        [style.width]="shape === 'circle' ? '3rem' : '16rem'"
        [style.height]="shape === 'text' || shape === 'title' ? null : '3rem'"
      />
    `,
  }),
};
