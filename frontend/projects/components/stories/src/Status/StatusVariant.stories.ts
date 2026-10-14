import type { StoryObj } from '@storybook/angular';

import type { StatusComponent } from '@shot-there/components';

export const Variant: StoryObj<StatusComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <st-status status="published">Published</st-status>
        <st-status status="draft">Draft</st-status>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`published` shows a filled dot in the success colour; `draft` a hollow ring.',
      },
    },
  },
};
