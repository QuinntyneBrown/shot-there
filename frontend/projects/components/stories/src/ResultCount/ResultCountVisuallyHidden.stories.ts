import type { StoryObj } from '@storybook/angular';

import type { ResultCountComponent } from '@shot-there/components';

export const VisuallyHidden: StoryObj<ResultCountComponent> = {
  render: () => ({
    template: `
      <div class="stack stack--sm">
        <st-result-count class="visually-hidden" text="9 studios" />
        <p>The count above is hidden but still announced, as in the admin lists.</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The global `visually-hidden` class on the host hides the count while keeping the live region.',
      },
    },
  },
};
