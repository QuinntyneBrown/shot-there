import type { StoryObj } from '@storybook/angular';

import type { CheckboxComponent } from '@shot-there/components';

export const Invalid: StoryObj<CheckboxComponent> = {
  render: () => ({
    template: `
      <st-checkbox
        label="I shot at Liberty Village Loft for this review"
        error="Confirm you shot here before publishing"
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`error` outlines the box in the danger colour and sets `aria-invalid`.',
      },
    },
  },
};
