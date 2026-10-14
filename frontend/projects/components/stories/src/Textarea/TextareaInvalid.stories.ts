import type { StoryObj } from '@storybook/angular';

import type { TextareaComponent } from '@shot-there/components';

export const Invalid: StoryObj<TextareaComponent> = {
  render: () => ({
    template: `
      <st-textarea
        style="max-width: 480px"
        label="Who it's for"
        [rows]="3"
        error="Write who this studio is for"
        help="Visitors read this first."
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`error` sets `aria-invalid` and is read before the help.',
      },
    },
  },
};
