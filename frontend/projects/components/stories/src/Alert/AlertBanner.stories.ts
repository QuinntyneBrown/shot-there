import type { StoryObj } from '@storybook/angular';

import type { AlertComponent } from '@shot-there/components';

export const Banner: StoryObj<AlertComponent> = {
  render: () => ({
    template: `
      <st-alert tone="info" role="status" banner>
        Studio reviews in Liberty Village are being reshot this month.
      </st-alert>
    `,
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: '`banner` drops the rounded corners and side borders for a full-width strip.',
      },
    },
  },
};
