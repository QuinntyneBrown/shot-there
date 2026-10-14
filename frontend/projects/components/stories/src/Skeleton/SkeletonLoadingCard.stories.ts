import type { StoryObj } from '@storybook/angular';

import type { SkeletonComponent } from '@shot-there/components';

export const LoadingCard: StoryObj<SkeletonComponent> = {
  render: () => ({
    template: `
      <section class="stack" aria-label="Studios" aria-busy="true" style="max-width: 320px">
        <p role="status">Loading studios…</p>
        <div class="stack">
          <st-skeleton shape="rect" style="aspect-ratio: 3 / 2" />
          <st-skeleton shape="title" style="width: 70%" />
          <div>
            <st-skeleton style="width: 50%" />
            <st-skeleton style="width: 50%" />
          </div>
        </div>
      </section>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A studio card loading: the region is `aria-busy` with one `role="status"` message, and the skeletons echo the card photo, name and details.',
      },
    },
  },
};
