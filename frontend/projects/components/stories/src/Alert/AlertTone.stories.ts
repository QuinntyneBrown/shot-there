import type { StoryObj } from '@storybook/angular';

import type { AlertComponent } from '@shot-there/components';

export const Tone: StoryObj<AlertComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <st-alert tone="info" title="Your session expired">Sign in again to carry on where you were.</st-alert>
        <st-alert tone="success" title="You've signed out.">Your session has ended on this device.</st-alert>
        <st-alert tone="warning" title="Permit rules may be out of date">
          We last checked these rules 207 days ago. Confirm with the Distillery District before you shoot.
        </st-alert>
        <st-alert tone="danger" title="Email or password is incorrect">
          Check both and try again. Passwords are case-sensitive.
        </st-alert>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Each `tone` sets the colours and the matching icon; `info` is the default.',
      },
    },
  },
};
