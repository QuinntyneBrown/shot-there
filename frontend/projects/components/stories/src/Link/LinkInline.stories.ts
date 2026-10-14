import type { StoryObj } from '@storybook/angular';

import type { LinkComponent } from '@shot-there/components';

export const Inline: StoryObj<LinkComponent> = {
  render: () => ({
    template: `
      <p style="max-width: 40rem">
        If a price, a measurement or an address is wrong, tell us at
        <a st-link href="mailto:corrections@shotthere.ca">corrections&#64;shotthere.ca</a> and
        we'll check it and fix it.
      </p>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'The default link sits inside a sentence and wraps with it.' },
    },
  },
};
