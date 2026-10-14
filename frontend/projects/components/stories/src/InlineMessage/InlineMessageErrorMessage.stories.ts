import type { StoryObj } from '@storybook/angular';

import type { InlineMessageComponent } from '@shot-there/components';

export const ErrorMessage: StoryObj<InlineMessageComponent> = {
  render: () => ({
    template: `
      <p st-inline-message tone="error" role="alert">
        gallery-04.jpg didn't upload. Check your connection.
      </p>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`tone="error"` adds the danger colour and glyph; `role="alert"` announces an error that appears without a submit.',
      },
    },
  },
};
