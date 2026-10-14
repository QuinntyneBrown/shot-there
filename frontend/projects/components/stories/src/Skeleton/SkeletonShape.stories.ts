import type { StoryObj } from '@storybook/angular';

import type { SkeletonComponent } from '@shot-there/components';

export const Shape: StoryObj<SkeletonComponent> = {
  render: () => ({
    template: `
      <div class="stack" aria-hidden="true" style="max-width: 360px">
        <st-skeleton shape="title" />
        <st-skeleton />
        <st-skeleton shape="rect" style="height: 8rem" />
        <st-skeleton shape="pill" style="width: 5rem; height: 2.75rem" />
        <st-skeleton shape="circle" style="width: 3rem; height: 3rem" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Each `shape`: `title` and `text` lines, a `rect` box, a `pill` for a button or flag, and a `circle` for round content.',
      },
    },
  },
};
