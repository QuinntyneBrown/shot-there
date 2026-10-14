import type { StoryObj } from '@storybook/angular';

import type { ProgressComponent } from '@shot-there/components';

export const Indeterminate: StoryObj<ProgressComponent> = {
  render: () => ({
    template: `
      <div style="max-width: 360px">
        <st-progress [value]="null" label="Processing gallery-05.jpg" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A `null` value slides a segment across the track and omits `aria-valuenow`, for work with no known amount.',
      },
    },
  },
};
