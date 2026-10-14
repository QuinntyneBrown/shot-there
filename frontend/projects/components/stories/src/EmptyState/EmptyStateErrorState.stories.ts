import type { StoryObj } from '@storybook/angular';

import type { EmptyStateComponent } from '@shot-there/components';

export const ErrorState: StoryObj<EmptyStateComponent> = {
  render: () => ({
    template: `
      <st-empty-state
        tone="error"
        icon="danger"
        [headingLevel]="3"
        role="alert"
        title="We couldn't load the studios"
        text="The studio list didn't arrive. Check your connection and try again; your filters are kept."
      >
        <button st-button slot="actions" type="button"><st-icon name="refresh" />Try again</button>
        <a st-button slot="actions" variant="ghost" href="#/">Go to the home page</a>
      </st-empty-state>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`tone="error"` tints the icon; the consumer adds `role="alert"` so the failure is announced, and offers a retry plus a way out.',
      },
    },
  },
};
