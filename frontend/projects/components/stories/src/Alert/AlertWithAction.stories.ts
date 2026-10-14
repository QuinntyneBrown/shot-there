import type { StoryObj } from '@storybook/angular';

import type { AlertComponent } from '@shot-there/components';

export const WithAction: StoryObj<AlertComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <st-alert tone="danger" role="alert" title="We couldn't load the re-verification list.">
          The counts above are current. Try again to see what needs checking.
          <button st-button slot="action" size="sm" type="button">
            <st-icon name="refresh" />Try again
          </button>
        </st-alert>
        <st-alert tone="success" title="You've signed out.">
          Your session has ended on this device.
          <a slot="action" href="#/">Go to the public site</a>
        </st-alert>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'One link or small button with `slot="action"` renders under the text.',
      },
    },
  },
};
