import type { StoryObj } from '@storybook/angular';

import type { AlertComponent } from '@shot-there/components';

export const BodyOnly: StoryObj<AlertComponent> = {
  render: () => ({
    template: `
      <st-alert role="status">
        You can compare up to 4 studios. We're showing the first 4 from this link.
      </st-alert>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Without a `title` the alert is a single paragraph, as on the comparison page.',
      },
    },
  },
};
