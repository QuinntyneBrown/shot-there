import type { StoryObj } from '@storybook/angular';

import type { IconButtonComponent } from '@shot-there/components';

export const Disabled: StoryObj<IconButtonComponent> = {
  render: () => ({
    template: `
      <button st-icon-button icon="trash" label="Remove test shot 2" type="button" disabled></button>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Native `disabled` dims the button to half opacity and shows the not-allowed cursor.',
      },
    },
  },
};
