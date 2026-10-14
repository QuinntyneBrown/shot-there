import type { StoryObj } from '@storybook/angular';

import type { CheckboxGroupComponent } from '@shot-there/components';

export const Invalid: StoryObj<CheckboxGroupComponent> = {
  render: () => ({
    props: {
      options: [
        { value: 'engagement', label: 'Engagement' },
        { value: 'family', label: 'Family' },
        { value: 'portrait', label: 'Portrait' },
        { value: 'brand', label: 'Brand' },
        { value: 'video', label: 'Video' },
      ],
    },
    template: `
      <st-checkbox-group
        label="Best for"
        name="bestUses"
        [options]="options"
        error="Choose at least one best use"
        help="Choose at least one before publishing."
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A group `error` shows under the legend, before the help, and marks every box invalid.',
      },
    },
  },
};
