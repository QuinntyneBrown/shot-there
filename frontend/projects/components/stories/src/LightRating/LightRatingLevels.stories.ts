import type { StoryObj } from '@storybook/angular';

import type { LightRatingComponent } from '@shot-there/components';

export const Levels: StoryObj<LightRatingComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <st-light-rating level="none" text="None" />
        <st-light-rating level="low" text="Low" />
        <st-light-rating level="medium" text="Medium" />
        <st-light-rating level="strong" text="Strong" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Each level fills one more pip: none shows three empty edges, strong three filled pips.',
      },
    },
  },
};
