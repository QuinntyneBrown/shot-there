import type { StoryObj } from '@storybook/angular';

import type { SelectComponent } from '@shot-there/components';

export const Invalid: StoryObj<SelectComponent> = {
  render: () => ({
    props: {
      options: [
        { value: '', label: 'Choose a type' },
        { value: 'park', label: 'Park' },
        { value: 'architecture', label: 'Architecture' },
        { value: 'waterfront', label: 'Waterfront' },
        { value: 'indoor', label: 'Indoor public' },
      ],
    },
    template: `<st-select style="max-width: 360px" label="Type" [options]="options" error="Choose a type" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: '`error` sets `aria-invalid` and shows under the select.',
      },
    },
  },
};
