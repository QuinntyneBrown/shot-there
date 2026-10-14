import type { StoryObj } from '@storybook/angular';

import type { DisclosureComponent } from '@shot-there/components';

export const Provided: StoryObj<DisclosureComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <st-disclosure title="How this session was paid for">
          This session was discounted by Leslieville Daylight Studio. That did not affect the scores.
          <a st-link href="#/editorial-policy">Editorial policy</a>
        </st-disclosure>
        <st-disclosure title="How this session was paid for">
          This session was provided free of charge by Liberty Cyc House. That did not affect the scores.
          <a st-link href="#/editorial-policy">Editorial policy</a>
        </st-disclosure>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A discounted or comped session names the studio; the callout looks exactly the same as a paid one.',
      },
    },
  },
};
