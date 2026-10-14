import type { StoryObj } from '@storybook/angular';

import type { CheckboxComponent } from '@shot-there/components';

export const DescriptionText: StoryObj<CheckboxComponent> = {
  name: 'Description',
  render: () => ({
    template: `
      <st-checkbox label="Natural light" description="At least medium at some time of day" />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`description` adds a muted line under the label, inside the clickable row.',
      },
    },
  },
};
