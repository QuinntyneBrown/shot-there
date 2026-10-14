import type { StoryObj } from '@storybook/angular';

import type { LinkComponent } from '@shot-there/components';

export const External: StoryObj<LinkComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <p><a st-link external href="https://www.youtube.com/@shotthere">Watch on YouTube</a></p>
        <p>
          <a st-link external href="https://www.google.com/maps/search/?api=1&amp;query=43.6473,-79.4196"
            >Open in Google Maps</a
          >
        </p>
        <p>
          Permit rules verified 1 September 2026 · Source:
          <a st-link external href="https://www.toronto.ca/"
            >City of Toronto: filming and photography in parks</a
          >
        </p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`external` opens a new tab with `rel="noopener"`, adds the arrow and ends the name with the hidden "(opens in a new tab)".',
      },
    },
  },
};
