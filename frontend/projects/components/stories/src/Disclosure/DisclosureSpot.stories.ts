import type { StoryObj } from '@storybook/angular';

import type { DisclosureComponent } from '@shot-there/components';

export const Spot: StoryObj<DisclosureComponent> = {
  render: () => ({
    template: `
      <st-disclosure title="How this visit was paid for">
        Shot on a regular visit; no one paid for or arranged this review.
        <a st-link href="#/editorial-policy">Editorial policy</a>
      </st-disclosure>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Outdoor spots such as Trinity Bellwoods use the visit wording, at the end of "Best uses".',
      },
    },
  },
};
